from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
from reportlab.platypus import (
    BaseDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, PageBreak, KeepTogether, PageTemplate, Frame, NextPageTemplate
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus.flowables import Flowable

# Register Carlito (Calibri-compatible)
import os
import platform

if platform.system() == "Windows":
    FONT_DIR = r"C:\Windows\Fonts"
    regular = os.path.join(FONT_DIR, "calibri.ttf")
    bold = os.path.join(FONT_DIR, "calibrib.ttf")
    italic = os.path.join(FONT_DIR, "calibrii.ttf")
    bolditalic = os.path.join(FONT_DIR, "calibriz.ttf")
else:
    FONT_DIR = "/usr/share/fonts/truetype/crosextra"
    regular = f"{FONT_DIR}/Carlito-Regular.ttf"
    bold = f"{FONT_DIR}/Carlito-Bold.ttf"
    italic = f"{FONT_DIR}/Carlito-Italic.ttf"
    bolditalic = f"{FONT_DIR}/Carlito-BoldItalic.ttf"

pdfmetrics.registerFont(TTFont('Carlito', regular))
pdfmetrics.registerFont(TTFont('Carlito-Bold', bold))
pdfmetrics.registerFont(TTFont('Carlito-Italic', italic))
pdfmetrics.registerFont(TTFont('Carlito-BoldItalic', bolditalic))
pdfmetrics.registerFontFamily('Carlito', normal='Carlito', bold='Carlito-Bold', italic='Carlito-Italic', boldItalic='Carlito-BoldItalic')

# --- COLOUR PALETTE ---
GOLD      = colors.HexColor('#B8860B')
DARK_GOLD = colors.HexColor('#8B6508')
OFF_BLACK = colors.HexColor('#1A1A1A')
LIGHT_BG  = colors.HexColor('#F9F6F0')
MID_GREY  = colors.HexColor('#666666')
LINE_GREY = colors.HexColor('#D4C9B0')
WHITE     = colors.white

W, H = A4
MARGIN = 18*mm

# --- STYLES ---
def S(name, **kw):
    base = kw.pop('parent', 'Normal')
    defaults = dict(fontName='Carlito', fontSize=10, leading=14,
                    textColor=OFF_BLACK, spaceAfter=0, spaceBefore=0)
    defaults.update(kw)
    return ParagraphStyle(name, **defaults)

sTitle       = S('sTitle',      fontName='Carlito-Bold', fontSize=28, leading=34, textColor=OFF_BLACK, alignment=TA_CENTER, spaceAfter=4)
sSubtitle    = S('sSubtitle',   fontName='Carlito-Italic', fontSize=13, leading=17, textColor=MID_GREY, alignment=TA_CENTER, spaceAfter=2)
sLabel       = S('sLabel',      fontName='Carlito-Bold', fontSize=8, leading=10, textColor=GOLD, spaceBefore=0, spaceAfter=1, letterSpacing=1.2)
sH1          = S('sH1',         fontName='Carlito-Bold', fontSize=16, leading=20, textColor=OFF_BLACK, spaceBefore=14, spaceAfter=4)
sH2          = S('sH2',         fontName='Carlito-Bold', fontSize=12, leading=16, textColor=OFF_BLACK, spaceBefore=10, spaceAfter=3)
sH3          = S('sH3',         fontName='Carlito-Bold', fontSize=10, leading=14, textColor=GOLD, spaceBefore=6, spaceAfter=2)
sBody        = S('sBody',       fontSize=10, leading=15, textColor=OFF_BLACK, spaceAfter=5)
sBodySmall   = S('sBodySmall',  fontSize=9,  leading=13, textColor=MID_GREY, spaceAfter=3)
sBullet      = S('sBullet',     fontSize=10, leading=15, leftIndent=12, firstLineIndent=-8, textColor=OFF_BLACK, spaceAfter=2)
sCaption     = S('sCaption',    fontName='Carlito-Italic', fontSize=8, leading=11, textColor=MID_GREY, alignment=TA_CENTER)
sTableHead   = S('sTableHead',  fontName='Carlito-Bold', fontSize=9,  leading=12, textColor=WHITE, alignment=TA_CENTER)
sTableCell   = S('sTableCell',  fontSize=9,  leading=12, textColor=OFF_BLACK, alignment=TA_CENTER)
sTableCellL  = S('sTableCellL', fontSize=9,  leading=12, textColor=OFF_BLACK, alignment=TA_LEFT)
sNote        = S('sNote',       fontName='Carlito-Italic', fontSize=9, leading=13, textColor=MID_GREY, spaceAfter=4)
sPhaseNum    = S('sPhaseNum',   fontName='Carlito-Bold', fontSize=36, leading=40, textColor=LINE_GREY, alignment=TA_RIGHT)
sMission     = S('sMission',    fontName='Carlito-Bold', fontSize=11, leading=16, textColor=DARK_GOLD, alignment=TA_CENTER)

def bullet(text):
    return Paragraph(f'<font color="#B8860B">&#8226;</font>  {text}', sBullet)

def sp(h=4):
    return Spacer(1, h*mm)

def rule(color=LINE_GREY, thickness=0.5):
    return HRFlowable(width='100%', thickness=thickness, color=color, spaceAfter=2, spaceBefore=2)

def gold_rule():
    return HRFlowable(width='100%', thickness=1.5, color=GOLD, spaceAfter=4, spaceBefore=4)

def section_label(text):
    return Paragraph(text.upper(), sLabel)

def h1(text):
    return Paragraph(text, sH1)

def h2(text):
    return Paragraph(text, sH2)

def h3(text):
    return Paragraph(text, sH3)

def body(text):
    return Paragraph(text, sBody)

def note(text):
    return Paragraph(f'<i>{text}</i>', sNote)

# --- TABLE HELPER ---
def make_table(headers, rows, col_widths, highlight_last=False):
    data = [[Paragraph(h, sTableHead) for h in headers]]
    for i, row in enumerate(rows):
        cells = []
        for j, cell in enumerate(row):
            style = sTableCellL if j == 0 else sTableCell
            if isinstance(cell, str) and cell.startswith('<b>'):
                style = S(f'bold_{i}_{j}', fontName='Carlito-Bold', fontSize=9, leading=12,
                          textColor=OFF_BLACK, alignment=TA_CENTER if j > 0 else TA_LEFT)
            cells.append(Paragraph(cell, style))
        data.append(cells)

    style = TableStyle([
        ('BACKGROUND',  (0,0), (-1,0),  OFF_BLACK),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [WHITE, LIGHT_BG]),
        ('GRID',        (0,0), (-1,-1), 0.3, LINE_GREY),
        ('LINEBELOW',   (0,0), (-1,0),  1,   GOLD),
        ('TOPPADDING',  (0,0), (-1,-1), 5),
        ('BOTTOMPADDING',(0,0),(-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING',(0,0), (-1,-1), 6),
        ('VALIGN',      (0,0), (-1,-1), 'MIDDLE'),
    ])
    if highlight_last:
        style.add('BACKGROUND', (0,-1), (-1,-1), colors.HexColor('#FFF8E7'))
        style.add('LINEABOVE',  (0,-1), (-1,-1), 1, GOLD)

    return Table(data, colWidths=col_widths, style=style, repeatRows=1)

# --- MILESTONE BOX ---
class MilestoneBox(Flowable):
    def __init__(self, year, age, title, items, width=None, accent=GOLD):
        super().__init__()
        self.year = year
        self.age = age
        self.title = title
        self.items = items
        self._width = width or (W - 2*MARGIN)
        self.accent = accent

    def wrap(self, aW, aH):
        self.calc_height()
        return (self._width, self._height)

    def calc_height(self):
        lines = len(self.items)
        self._height = 14*mm + lines * 6*mm + 4*mm

    def draw(self):
        c = self.canv
        w, h = self._width, self._height
        # Background
        c.setFillColor(LIGHT_BG)
        c.roundRect(0, 0, w, h, 3*mm, fill=1, stroke=0)
        # Left accent bar
        c.setFillColor(self.accent)
        c.rect(0, 0, 3*mm, h, fill=1, stroke=0)
        # Year badge
        c.setFillColor(OFF_BLACK)
        c.roundRect(5*mm, h-11*mm, 20*mm, 8*mm, 1.5*mm, fill=1, stroke=0)
        c.setFillColor(WHITE)
        c.setFont('Carlito-Bold', 9)
        c.drawCentredString(15*mm, h-7.5*mm, self.year)
        # Age
        c.setFillColor(MID_GREY)
        c.setFont('Carlito', 8)
        c.drawString(27*mm, h-7.5*mm, f'Age {self.age}')
        # Title
        c.setFillColor(OFF_BLACK)
        c.setFont('Carlito-Bold', 11)
        c.drawString(5*mm, h-14*mm, self.title)
        # Items
        c.setFont('Carlito', 9)
        c.setFillColor(OFF_BLACK)
        for i, item in enumerate(self.items):
            y = h - 18*mm - i*6*mm
            c.setFillColor(self.accent)
            c.circle(6.5*mm, y+2*mm, 1*mm, fill=1, stroke=0)
            c.setFillColor(OFF_BLACK)
            c.drawString(9*mm, y, item)

# --- PHASE HEADER ---
class PhaseHeader(Flowable):
    def __init__(self, number, title, subtitle, years, width=None):
        super().__init__()
        self.number = number
        self.title = title
        self.subtitle = subtitle
        self.years = years
        self._width = width or (W - 2*MARGIN)
        self._height = 28*mm

    def wrap(self, aW, aH):
        return (self._width, self._height)

    def draw(self):
        c = self.canv
        w, h = self._width, self._height
        # Background
        c.setFillColor(OFF_BLACK)
        c.roundRect(0, 0, w, h, 3*mm, fill=1, stroke=0)
        # Gold bottom bar
        c.setFillColor(GOLD)
        c.roundRect(0, 0, w, 5*mm, 2*mm, fill=1, stroke=0)
        c.rect(0, 2*mm, w, 3*mm, fill=1, stroke=0)
        # Phase number (large, right-aligned, subtle)
        c.setFillColor(colors.HexColor('#2A2A2A'))
        c.setFont('Carlito-Bold', 52)
        c.drawRightString(w-5*mm, 4*mm, self.number)
        # Phase label
        c.setFillColor(GOLD)
        c.setFont('Carlito-Bold', 8)
        c.drawString(6*mm, h-8*mm, 'PHASE')
        # Title
        c.setFillColor(WHITE)
        c.setFont('Carlito-Bold', 16)
        c.drawString(6*mm, h-16*mm, self.title)
        # Subtitle
        c.setFillColor(colors.HexColor('#AAAAAA'))
        c.setFont('Carlito-Italic', 9)
        c.drawString(6*mm, h-22*mm, self.subtitle)
        # Years pill
        pill_w = 30*mm
        c.setFillColor(GOLD)
        c.roundRect(w-pill_w-6*mm, h-14*mm, pill_w, 7*mm, 3*mm, fill=1, stroke=0)
        c.setFillColor(OFF_BLACK)
        c.setFont('Carlito-Bold', 9)
        c.drawCentredString(w-6*mm-pill_w/2, h-11.5*mm, self.years)

# --- COVER PAGE ---
class CoverPage(Flowable):
    def __init__(self, width, height):
        super().__init__()
        self.width = width
        self.height = height

    def wrap(self, availWidth, availHeight): # type: ignore
        return (self.width, self.height)

    def draw(self):
        c = self.canv
        w, h = self.width, self.height
        # FULL BACKGROUND
        c.setFillColor(OFF_BLACK)
        c.rect(0, 0, w, h, fill=1, stroke=0)
        # Gold accent top strip
        c.setFillColor(GOLD)
        c.rect(0, h-8*mm, w, 8*mm, fill=1, stroke=0)
        # Subtle grid lines
        c.setStrokeColor(colors.HexColor('#252525'))
        c.setLineWidth(0.5)
        for i in range(0, int(h), 15):
            c.line(0, i, w, i)
        # Large W watermark
        c.setFillColor(colors.HexColor('#222222'))
        c.setFont('Carlito-Bold', 220)
        c.drawCentredString(w/2, h*0.25, 'W')
        # Gold vertical accent
        c.setFillColor(GOLD)
        c.rect(MARGIN, h*0.28, 1.5*mm, h*0.45, fill=1, stroke=0)
        # Main title
        c.setFillColor(WHITE)
        c.setFont('Carlito-Bold', 36)
        c.drawString(MARGIN + 6*mm, h*0.68, 'LIFE OPERATING')
        c.drawString(MARGIN + 6*mm, h*0.62, 'SYSTEM')
        # Gold rule
        c.setFillColor(GOLD)
        c.rect(MARGIN + 6*mm, h*0.605, 80*mm, 0.8*mm, fill=1, stroke=0)
        # Subtitle
        c.setFillColor(colors.HexColor('#AAAAAA'))
        c.setFont('Carlito-Italic', 12)
        c.drawString(MARGIN + 6*mm, h*0.565, 'Lensen Wakasa  |  Wakasa Labs')
        # Mission line
        c.setFillColor(GOLD)
        c.setFont('Carlito', 10)
        c.drawString(MARGIN + 6*mm, h*0.52, 'Mission: Build intelligence systems that accelerate scientific discovery.')
        # Bottom info
        c.setFillColor(colors.HexColor('#888888'))
        c.setFont('Carlito', 9)
        c.drawString(MARGIN + 6*mm, 18*mm, 'Version 2.0  |  June 2026  |  Confidential')
        c.drawRightString(w - MARGIN, 18*mm, 'Age 20 \u2192 $100B+  |  Nairobi \u2192 US \u2192 Stars')

# ============================================================
# BUILD DOCUMENT
# ============================================================
def build():
    output_dir = os.path.join(os.path.dirname(__file__), 'outputs')
    os.makedirs(output_dir, exist_ok=True)
    path = os.path.join(output_dir, 'Lensen_Wakasa_Life_OS_v2.pdf')

    doc = BaseDocTemplate(
        path, pagesize=A4,
        leftMargin=MARGIN, rightMargin=MARGIN,
        topMargin=MARGIN, bottomMargin=MARGIN,
        title='Life Operating System v2', author='Lensen Wakasa'
    )
    doc.addPageTemplates([
        PageTemplate(
            id='Cover',
            frames=[Frame(0, 0, W, H, leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)],
        ),
        PageTemplate(
            id='Later',
            frames=[
                Frame(
                    MARGIN, MARGIN, W - 2*MARGIN, H - 2*MARGIN,
                    leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0,
                    id='normal',
                )
            ],
        ),
    ])

    story = []

    # ---- COVER ----
    story.append(CoverPage(W, H))
    story.append(NextPageTemplate('Later'))
    story.append(PageBreak())

    # ---- MISSION STATEMENT ----
    story.append(sp(4))
    story.append(section_label('The Foundation'))
    story.append(h1('Mission & Core Identity'))
    story.append(gold_rule())
    story.append(sp(2))

    story.append(Paragraph(
        'I am building intelligence systems that help humanity discover faster than it currently can.',
        sMission))
    story.append(sp(3))

    story.append(body(
        'The core thesis: the people who solve humanity\'s hardest problems \u2014 fusion energy, longevity, interstellar travel \u2014 are not always the deepest domain experts. They are often the builders who combine AI, scientific reasoning, and systems thinking into one organisation. That is Wakasa Labs.'))
    story.append(sp(2))

    # Three pillars table
    pillars = [
        ['ACSIS', 'Centai', 'Wakasa Labs'],
        ['AI Research Engine', 'Scientific Discovery AI', 'Conglomerate Vehicle'],
        ['Solving continual learning\nas the core AI problem',
         'Applying solved AI to\nscience: fusion, longevity, space',
         'Equity, funding, and\nlong-term mission structure'],
    ]
    pil_style = TableStyle([
        ('BACKGROUND',    (0,0), (-1,0), OFF_BLACK),
        ('BACKGROUND',    (0,1), (-1,1), colors.HexColor('#2A2A2A')),
        ('BACKGROUND',    (0,2), (-1,2), LIGHT_BG),
        ('TEXTCOLOR',     (0,0), (-1,0), GOLD),
        ('TEXTCOLOR',     (0,1), (-1,1), WHITE),
        ('TEXTCOLOR',     (0,2), (-1,2), OFF_BLACK),
        ('FONTNAME',      (0,0), (-1,0), 'Carlito-Bold'),
        ('FONTNAME',      (0,1), (-1,1), 'Carlito-Bold'),
        ('FONTNAME',      (0,2), (-1,2), 'Carlito'),
        ('FONTSIZE',      (0,0), (-1,-1), 9),
        ('LEADING',       (0,0), (-1,-1), 13),
        ('ALIGN',         (0,0), (-1,-1), 'CENTER'),
        ('VALIGN',        (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING',    (0,0), (-1,-1), 7),
        ('BOTTOMPADDING', (0,0), (-1,-1), 7),
        ('GRID',          (0,0), (-1,-1), 0.3, LINE_GREY),
        ('LINEBELOW',     (0,0), (-1,0), 1.5, GOLD),
        ('LINEBELOW',     (0,1), (-1,1), 0.5, LINE_GREY),
        ('BOX',           (0,0), (-1,-1), 1, LINE_GREY),
    ])
    cw = (W - 2*MARGIN) / 3
    pil_data = []
    for row in pillars:
        pil_data.append([Paragraph(cell, S(f'p{i}', fontName='Carlito-Bold' if pillars.index(row)<2 else 'Carlito',
                                           fontSize=9, leading=13, alignment=TA_CENTER,
                                           textColor=GOLD if pillars.index(row)==0 else (WHITE if pillars.index(row)==1 else OFF_BLACK)))
                         for i, cell in enumerate(row)])
    story.append(Table(pil_data, colWidths=[cw,cw,cw], style=pil_style))
    story.append(sp(3))

    story.append(note('ACSIS is not a product to sell. It is the internal AI research programme. Solving continual learning inside ACSIS is the prerequisite for everything Centai does.'))
    story.append(PageBreak())

    # ---- MASTER TIMELINE OVERVIEW ----
    story.append(section_label('Overview'))
    story.append(h1('Master Timeline at a Glance'))
    story.append(gold_rule())
    story.append(sp(2))

    tl_headers = ['Phase', 'Age', 'Period', 'Primary Focus', 'Net Worth Target']
    tl_rows = [
        ['Foundation',    '20\u201322', '2025\u20132027', 'Clinical Medicine + ACSIS research + math', '$0 \u2192 $30K'],
        ['Clinical Completion', '22\u201323', '2027\u20132028', 'Final year + IELTS + grad school prep', '$30K \u2192 $60K'],
        ['Internship',    '23\u201324', '2028\u20132029', 'Medical internship + applications + Centai v1', '$60K \u2192 $120K'],
        ['Masters (US)',  '24\u201326', '2029\u20132031', 'Funded master\'s + research + Wakasa Labs registered', '$120K \u2192 $400K'],
        ['OPT / Scale',   '26\u201328', '2031\u20132033', 'STEM OPT + publications + Centai scaling', '$400K \u2192 $2M'],
        ['Wealth Creation','28\u201330', '2033\u20132035', 'O-1A / EB-2 NIW + first major exits', '$2M \u2192 $10M'],
        ['Propulsion Era', '30\u201340', '2035\u20132045', 'Use solved AI to attack fusion & propulsion', '$10M \u2192 $1B+'],
        ['Endgame',       '40\u201360', '2045\u20132065', 'Company IPO + interstellar mission funding', '$1B+ \u2192 $60B+'],
    ]
    cw2 = [(W-2*MARGIN)*f for f in [0.14, 0.08, 0.14, 0.40, 0.24]]
    story.append(make_table(tl_headers, tl_rows, cw2))
    story.append(PageBreak())

    # ======================================================
    # PHASE 1
    # ======================================================
    story.append(PhaseHeader('01', 'Foundation', 'Clinical Medicine + ACSIS Research + Mathematical Groundwork', '2025 \u2013 2027'))
    story.append(sp(4))

    story.append(section_label('Objective'))
    story.append(body('Finish the degree with distinction. Begin ACSIS as a genuine AI research programme \u2014 not a side project. Build mathematical foundations. Establish Wakasa Labs\' public presence. Save the first $30K.'))
    story.append(sp(2))

    story.append(h2('Financial Trajectory'))
    fin1_h = ['Period', 'Primary Income', 'Monthly Target', 'Annual Savings', 'Net Worth']
    fin1_r = [
        ['2025 (now)',     'Hydra trading + freelance AI', '$300\u2013600',  '$4K',   '$4K'],
        ['Early 2026',     'Freelance AI consulting',       '$1K\u20132K',   '$15K',  '$19K'],
        ['Late 2026',      'Freelance scaling',             '$2K\u20134K',   '$25K',  '$28K\u201335K'],
        ['<b>2027 end</b>','<b>Course completes</b>',       '<b>$3K\u20135K</b>', '<b>$30K+</b>', '<b>$35K</b>'],
    ]
    cw3 = [(W-2*MARGIN)*f for f in [0.18, 0.28, 0.18, 0.18, 0.18]]
    story.append(make_table(fin1_h, fin1_r, cw3, highlight_last=True))
    story.append(sp(3))

    story.append(h2('ACSIS: The Research Programme'))
    story.append(body('ACSIS is Wakasa Labs\' internal AI research arm. The specific problem it targets is <b>continual learning</b> \u2014 the ability of an AI system to acquire new knowledge over time without catastrophically forgetting prior knowledge. This is a fundamental unsolved problem, and solving it is the prerequisite for Centai.'))
    story.append(sp(1))
    for item in [
        '2025\u20132026: Study the literature deeply \u2014 EWC, progressive neural networks, memory replay, meta-learning approaches',
        '2026: Implement SOMA (your current biologically-plausible architecture) as baseline \u2014 Hodgkin-Huxley dynamics, STDP, Free Energy Principle',
        '2026\u20132027: Fix outstanding gradient issues in SOMA; run systematic experiments; document results',
        '2027: Write up findings as a research note / white paper \u2014 this becomes your first publication artefact',
        '2027: Open-source the codebase on GitHub under Wakasa Labs',
    ]:
        story.append(bullet(item))
    story.append(sp(3))

    story.append(h2('Mathematical Foundations'))
    for item in [
        'Linear Algebra \u2014 complete by mid-2026 (Gilbert Strang MIT OCW)',
        'Calculus I & II \u2014 complete by end 2026',
        'Probability & Statistics \u2014 complete by mid-2027',
        'Optimisation basics \u2014 complete by end 2027',
    ]:
        story.append(bullet(item))
    story.append(sp(3))

    story.append(h2('Infrastructure to Build by End 2027'))
    infra_items = [
        ('wakasalabs.com', 'Mission site: research areas, ACSIS, Centai roadmap, publications'),
        ('lensenwakasa.com', 'Personal site: story, projects, CV, research notes'),
        ('GitHub', 'ACSIS/SOMA codebase public and documented'),
        ('6+ technical articles', 'Published on Substack or personal blog \u2014 show thinking publicly'),
        ('Notion: Mission Proxima', 'Track education, Wakasa Labs, publications, immigration, wealth, network'),
        ('Passport', 'Obtained and valid well before any travel needs'),
        ('LinkedIn', 'Professional profile reflecting AI researcher + founder identity'),
    ]
    iw = [(W-2*MARGIN)*f for f in [0.28, 0.72]]
    id_data = [[Paragraph('<b>' + k + '</b>', sTableCellL), Paragraph(v, sTableCellL)] for k, v in infra_items]
    id_style = TableStyle([
        ('ROWBACKGROUNDS', (0,0), (-1,-1), [WHITE, LIGHT_BG]),
        ('GRID',           (0,0), (-1,-1), 0.3, LINE_GREY),
        ('TOPPADDING',     (0,0), (-1,-1), 5),
        ('BOTTOMPADDING',  (0,0), (-1,-1), 5),
        ('LEFTPADDING',    (0,0), (-1,-1), 6),
        ('RIGHTPADDING',   (0,0), (-1,-1), 6),
        ('VALIGN',         (0,0), (-1,-1), 'TOP'),
    ])
    story.append(Table(id_data, colWidths=iw, style=id_style))
    story.append(PageBreak())

    # ======================================================
    # PHASE 2: Clinical Completion
    # ======================================================
    story.append(PhaseHeader('02', 'Clinical Completion & Grad School Prep', 'Final Year + IELTS + Professor Network + Applications', '2027 \u2013 2028'))
    story.append(sp(4))

    story.append(section_label('Objective'))
    story.append(body('Complete your final clinical year at full academic standard. Simultaneously, prepare everything required for a US graduate school application: IELTS, personal statement, recommendation letters, and a portfolio of research evidence.'))
    story.append(sp(2))

    story.append(h2('Key Milestones'))
    ms2 = [
        MilestoneBox('2027 Q1', '22', 'Final Clinical Year Begins',
                     ['Maintain GPA / academic standing', 'Continue ACSIS research in evenings', 'Begin IELTS preparation (target 7.0+)']),
        MilestoneBox('2027 Q2', '22', 'IELTS Examination',
                     ['Sit IELTS Academic \u2014 target Band 7.0 minimum, 7.5+ preferred',
                      'If below target, resit within 3 months',
                      'Begin contacting professors in target departments']),
        MilestoneBox('2027 Q3', '22', 'Application Research',
                     ['Identify 10 target schools (3 dream / 4 strong / 3 safe)',
                      'Build professor spreadsheet: name, university, research area, contact status',
                      'Target 30\u201350 professors known by name before applying',
                      'Publish ACSIS research note \u2014 gives professors something to read']),
        MilestoneBox('2027 Q4', '22\u201323', 'Application Preparation',
                     ['Draft personal statement (research-focused, not clinical)',
                      'Request recommendation letters \u2014 give recommenders 3 months notice',
                      'Finalise portfolio: GitHub, website, publications, ACSIS white paper',
                      'Complete applications (most US deadlines: December\u2013January)']),
        MilestoneBox('2028 Jan\u2013Mar', '23', 'Course Completion',
                     ['Final exams and clinical sign-offs',
                      'Applications submitted \u2014 awaiting decisions',
                      'COC (Certificate of Completion) process begun',
                      'Begin internship application process in parallel']),
    ]
    for m in ms2:
        story.append(m)
        story.append(sp(2))

    story.append(sp(2))
    story.append(h2('IELTS Preparation Plan'))
    story.append(body('IELTS Academic is required by almost all US graduate programmes for international students. Start preparation 6 months before intended test date.'))
    story.append(sp(1))
    ielts_h = ['Section', 'Target Band', 'Key Skills to Build']
    ielts_r = [
        ['Listening', '7.5+', 'Academic lecture comprehension, note-taking speed'],
        ['Reading',   '7.5+', 'Skimming complex texts, matching headings, inference'],
        ['Writing',   '7.0+', 'Task 2 academic essays \u2014 structured argument, vocabulary range'],
        ['Speaking',  '7.0+', 'Fluency under pressure, technical vocabulary, pronunciation'],
        ['<b>Overall</b>', '<b>7.0+ (min)</b>', '<b>7.5 preferred for top programmes</b>'],
    ]
    cw4 = [(W-2*MARGIN)*f for f in [0.18, 0.20, 0.62]]
    story.append(make_table(ielts_h, ielts_r, cw4, highlight_last=True))
    story.append(PageBreak())

    # Target schools
    story.append(h2('Target Universities'))
    story.append(body('The programme type to target: Computational Biology, Machine Learning, Computational Science, or Biomedical AI. These are STEM-classified, which is essential for STEM OPT (3 years post-graduation work authorisation). Funded positions (RA/TA) are the goal \u2014 tuition waiver + stipend.'))
    story.append(sp(2))

    schools_h = ['Tier', 'University', 'Target Programme', 'Why It Fits']
    schools_r = [
        ['Dream', 'Carnegie Mellon',     'Computational Biology / MCDS', 'Best AI + science intersection; strong research culture'],
        ['Dream', 'MIT',                 'Computational Science / EECS', 'Fusion ecosystem; best AI research globally'],
        ['Dream', 'Stanford',            'CS / Biomedical Informatics',  'AI + medicine; strong West Coast tech network'],
        ['Strong','Georgia Tech',        'ML / Computational Science',   'Underrated; strong AI programme; more accessible'],
        ['Strong','Johns Hopkins',       'Biomedical Engineering / AI',  'Direct bridge from clinical medicine background'],
        ['Strong','UC San Diego',        'Computational Biology',        'Strong programme; research-active faculty'],
        ['Strong','University of Michigan','CSE / Bioinformatics',       'Good research funding; solid industry connections'],
        ['Safe',  'Arizona State',       'CS / ML',                     'Strong STEM OPT culture; accessible admissions'],
        ['Safe',  'Northeastern',        'Data Science / AI',            'Co-op model; good industry exposure'],
        ['Safe',  'University at Buffalo','CS / Bioinformatics',         'Good acceptance rates; STEM eligible'],
    ]
    cw5 = [(W-2*MARGIN)*f for f in [0.10, 0.22, 0.26, 0.42]]
    story.append(make_table(schools_h, schools_r, cw5))
    story.append(sp(2))
    story.append(note('Apply to all 10. Never apply to only dream schools. The goal is getting to the US, not prestige for its own sake.'))
    story.append(PageBreak())

    # ======================================================
    # PHASE 3: Internship
    # ======================================================
    story.append(PhaseHeader('03', 'Medical Internship', 'July 2028 \u2013 July 2029 | Parallel Track: Centai v1 + US Visa Prep', '2028 \u2013 2029'))
    story.append(sp(4))

    story.append(section_label('Objective'))
    story.append(body('Complete the mandatory medical internship. This is non-negotiable legally and professionally. The key discipline is maintaining the parallel track: internship in the day, Wakasa Labs research in the evenings. By the end of this phase you should have graduate school acceptances confirmed and a US student visa in hand.'))
    story.append(sp(2))

    story.append(h2('Internship Timeline'))
    int_h = ['Period', 'Medical Focus', 'Wakasa Labs Focus']
    int_r = [
        ['Jul\u2013Sep 2028', 'Internal Medicine rotation',         'Centai v1 architecture design; begin implementation'],
        ['Oct\u2013Dec 2028', 'Surgery rotation',                   'ACSIS paper finalised and submitted to arXiv / preprint'],
        ['Jan\u2013Mar 2029', 'Paediatrics / OB-GYN rotation',      'Grad school decisions arriving; finalise choice; F-1 visa DS-2019'],
        ['Apr\u2013Jun 2029', 'Community / Psychiatry rotation',     'F-1 visa application at US Embassy; travel prep'],
        ['<b>Jul 2029</b>',   '<b>Internship complete</b>',          '<b>Fly to US. Master\'s begins.</b>'],
    ]
    cw6 = [(W-2*MARGIN)*f for f in [0.20, 0.40, 0.40]]
    story.append(make_table(int_h, int_r, cw6, highlight_last=True))
    story.append(sp(3))

    story.append(h2('US Visa Process (F-1 Student Visa)'))
    story.append(body('The F-1 visa allows you to study in the US for the duration of your programme plus OPT work authorisation. Key steps:'))
    story.append(sp(1))
    visa_items = [
        ('Accept offer & get I-20', 'University issues your I-20 (Certificate of Eligibility). Required before any visa step.'),
        ('Pay SEVIS fee', 'One-time $350 fee. Pay at fmjfee.com with your I-20 details.'),
        ('Complete DS-160', 'Online non-immigrant visa application. Be accurate and detailed.'),
        ('Schedule Embassy interview', 'Book at US Embassy Nairobi. Allow 4\u20138 weeks lead time.'),
        ('Attend interview', 'Bring: I-20, DS-160 confirmation, SEVIS receipt, acceptance letter, financial evidence, passport.'),
        ('Visa issued / travel', 'F-1 typically issued within 5 business days of interview if approved.'),
    ]
    v_data = [[Paragraph(f'<b>{k}</b>', sTableCellL), Paragraph(v, sTableCellL)] for k, v in visa_items]
    v_style = TableStyle([
        ('ROWBACKGROUNDS', (0,0), (-1,-1), [WHITE, LIGHT_BG]),
        ('GRID',           (0,0), (-1,-1), 0.3, LINE_GREY),
        ('TOPPADDING',     (0,0), (-1,-1), 5),
        ('BOTTOMPADDING',  (0,0), (-1,-1), 5),
        ('LEFTPADDING',    (0,0), (-1,-1), 6),
        ('RIGHTPADDING',   (0,0), (-1,-1), 6),
        ('VALIGN',         (0,0), (-1,-1), 'TOP'),
        ('LINEAFTER',      (0,0), (0,-1),  0.5, LINE_GREY),
    ])
    story.append(Table(v_data, colWidths=[(W-2*MARGIN)*0.32, (W-2*MARGIN)*0.68], style=v_style))
    story.append(sp(2))
    story.append(note('F-1 status lasts for the Duration of Status (D/S) \u2014 you stay legally as long as you are enrolled and in good academic standing. After graduation, OPT and STEM OPT extension give you up to 36 months of US work authorisation.'))
    story.append(PageBreak())

    # ======================================================
    # PHASE 4: Masters
    # ======================================================
    story.append(PhaseHeader('04', "Master's in the US", 'Computational Science / ML / Computational Biology | STEM OPT Eligible', '2029 \u2013 2031'))
    story.append(sp(4))

    story.append(section_label('Objective'))
    story.append(body('A funded 2-year master\'s is not just a degree. It is US network access, research credibility, immigration runway (STEM OPT = 3 years work authorisation after graduation), and the period when Centai transitions from prototype to a defensible research system. This is the highest-leverage 24 months of the entire plan.'))
    story.append(sp(2))

    story.append(h2('Year 1 (2029\u20132030): Research + Build'))
    for item in [
        'Establish research relationship with 1\u20132 faculty advisors in AI / computational science',
        'Complete coursework: machine learning theory, numerical methods, probability, scientific computing',
        'Centai v1: working system capable of reasoning over a scientific domain (begin with biology or materials)',
        'Publish: at least 1 conference paper or strong preprint from ACSIS/Centai work',
        'Register Wakasa Labs Inc. (Delaware C-Corp) once financially stable \u2014 you already have the structure',
        'Network: attend 2+ academic conferences; connect with researchers working on AI for science',
        'Financial: TA/RA stipend + freelance consulting = $2K\u20133K/month; save aggressively',
    ]:
        story.append(bullet(item))
    story.append(sp(2))

    story.append(h2('Year 2 (2030\u20132031): Scale + Transition'))
    for item in [
        'Thesis / capstone project: Centai architecture as the submission',
        'Publications: 2\u20133 total by graduation (conference + preprints)',
        'Wakasa Labs: first external attention (media, research community, potential investors)',
        'OPT application: file 90 days before graduation; STEM OPT extension application ready',
        'Begin O-1A evidence building in earnest (publications, citations, speaking invitations, press)',
        'Job offers or research positions as backup: have options before graduation',
        'Net worth target by graduation: $200K\u2013400K',
    ]:
        story.append(bullet(item))
    story.append(sp(3))

    story.append(h2('Immigration Path Post-Masters'))
    imm_h = ['Status', 'Duration', 'What You Can Do', 'Next Step']
    imm_r = [
        ['F-1 (student)',   '2 years',    'Study, TA/RA work on campus', 'Apply for OPT 90 days before graduation'],
        ['OPT',             '12 months',  'Work anywhere in the US in your field', 'Apply for STEM OPT extension'],
        ['STEM OPT',        '24 months',  'Work at E-Verify employer; run research', 'Build O-1A or EB-2 NIW evidence'],
        ['O-1A',            '3 yr + ext', 'Work for specific employer or own company', 'Transition to EB-1A or EB-2 NIW'],
        ['<b>EB-2 NIW / Green Card</b>', '<b>Permanent</b>', '<b>Live and work in US permanently</b>', '<b>Citizenship after 5 years</b>'],
    ]
    cw7 = [(W-2*MARGIN)*f for f in [0.22, 0.14, 0.34, 0.30]]
    story.append(make_table(imm_h, imm_r, cw7, highlight_last=True))
    story.append(sp(2))

    story.append(h2('What is EB-2 NIW?'))
    story.append(body('<b>EB-2 National Interest Waiver</b> is a US permanent residency path for people with an advanced degree whose work substantially benefits the United States. Unlike H-1B, there is no lottery and no employer sponsorship required \u2014 you can self-petition. For a founder-researcher working on AI for scientific discovery, fusion, or longevity, this is the most natural long-term path. The goal is not to chase it \u2014 the goal is to become the person who naturally qualifies.'))
    story.append(sp(1))
    story.append(body('<b>What qualifies as evidence:</b> peer-reviewed publications, citations, conference presentations, judging roles (reviewer, programme committee), press coverage, letters from leading researchers, and significant contributions to your field.'))
    story.append(PageBreak())

    # ======================================================
    # PHASE 5: OPT + Scale
    # ======================================================
    story.append(PhaseHeader('05', 'OPT / STEM OPT + Wakasa Labs Scale', 'Research, Publications, O-1A Evidence, Centai Expansion', '2031 \u2013 2033'))
    story.append(sp(4))

    story.append(section_label('Objective'))
    story.append(body('36 months of legal US work authorisation. Use every month. This is the window to publish, build Centai into a fundable research company, secure your immigration status, and cross $1M net worth.'))
    story.append(sp(2))

    story.append(h2('Annual Targets'))
    opt_h = ['Year', 'Age', 'Research / ACSIS', 'Wakasa Labs / Centai', 'Immigration', 'Net Worth']
    opt_r = [
        ['2031', '26', '3\u20134 publications total; conference talks', 'Centai v2; first external pilots', 'OPT active; STEM OPT filed', '$400K'],
        ['2032', '27', 'Citations growing; reviewer invitations', 'First revenue from Centai API / tools', 'STEM OPT active; O-1A prep', '$1M'],
        ['2033', '28', 'Strong publication record; press mentions', 'Series A prep or significant revenue', 'O-1A filed / approved', '$2M'],
    ]
    cw8 = [(W-2*MARGIN)*f for f in [0.08, 0.07, 0.25, 0.25, 0.20, 0.15]]
    story.append(make_table(opt_h, opt_r, cw8))
    story.append(sp(3))

    story.append(h2('O-1A Visa: What It Is'))
    story.append(body('<b>O-1A</b> is a temporary non-immigrant visa for individuals with extraordinary ability in science, technology, engineering, or business. It is not permanent residency, but it bridges the gap while EB-2 NIW is pending and allows you to stay in the US running your own company.'))
    story.append(sp(1))
    story.append(body('USCIS requires evidence in at least 3 of 8 criteria: awards, membership in elite organisations, press coverage, judging the work of others, original contributions of major significance, authorship of scholarly articles, critical role in distinguished organisations, or high salary. You should be building evidence in at least 5 by 2033.'))
    story.append(sp(3))

    story.append(h2('Centai Development Roadmap'))
    centai_h = ['Version', 'Period', 'Capability', 'Scientific Domain Target']
    centai_r = [
        ['v1', '2028\u20132029', 'Reasoning over curated scientific literature', 'Biology / genomics'],
        ['v2', '2030\u20132031', 'Hypothesis generation and experiment suggestion', 'Materials science'],
        ['v3', '2032\u20132033', 'Multi-domain synthesis; connects findings across fields', 'Energy + biology'],
        ['v4', '2034+',         'Full scientific discovery loop: read, hypothesise, simulate, iterate', 'Fusion + longevity'],
    ]
    cw9 = [(W-2*MARGIN)*f for f in [0.08, 0.18, 0.40, 0.34]]
    story.append(make_table(centai_h, centai_r, cw9))
    story.append(PageBreak())

    # ======================================================
    # PHASE 6: Wealth Creation
    # ======================================================
    story.append(PhaseHeader('06', 'Wealth Creation', 'First Major Exits + EB-2 NIW + Wakasa Labs Fundraising', '2033 \u2013 2035'))
    story.append(sp(4))

    story.append(section_label('Objective'))
    story.append(body('Cross $10M net worth. Secure permanent US residency. Transition Wakasa Labs from a research organisation to a funded, revenue-generating company positioned to attack fusion and advanced propulsion.'))
    story.append(sp(2))

    story.append(h2('Net Worth Path to $10M'))
    nw_h = ['Age', 'Year', 'Wealth Source', 'Annual Add', 'Net Worth']
    nw_r = [
        ['28', '2033', 'Centai revenue + consulting + investments', '$600K\u20131M', '$2M'],
        ['29', '2034', 'Series A equity event or significant exit', '$2\u20135M',    '$5M\u20137M'],
        ['30', '2035', 'Post-exit + Wakasa Labs equity growth',     '$3\u20135M',    '<b>$10M</b>'],
    ]
    cw10 = [(W-2*MARGIN)*f for f in [0.08, 0.10, 0.42, 0.20, 0.20]]
    story.append(make_table(nw_h, nw_r, cw10, highlight_last=True))
    story.append(sp(3))

    story.append(h2('How the $10M is Built'))
    for item in [
        'Centai licensing / API revenue: $500K\u20131M cumulative',
        'Consulting and research contracts: $300K\u2013500K cumulative',
        'Wakasa Labs equity (if raised $5\u201310M Series A at $30\u201350M valuation, you own 40\u201360%): $12\u201330M paper value; sell small secondary for liquidity',
        'Angel investments in 2\u20133 early-stage science/AI startups: 1 could 10x',
        'Savings from stipend and freelance since 2025: $100K\u2013200K compounded',
    ]:
        story.append(bullet(item))
    story.append(PageBreak())

    # ======================================================
    # PHASE 7+: The Long Game
    # ======================================================
    story.append(PhaseHeader('07', 'The Long Game', 'Propulsion Era + Billionaire Path + Interstellar Mission', '2035 \u2013 2065'))
    story.append(sp(4))

    story.append(section_label('The Strategic Thesis'))
    story.append(body('If ACSIS solves continual learning, and Centai applies that to scientific discovery, then Wakasa Labs has a genuine tool to accelerate fusion research in a way no fusion company currently has. The propulsion era does not begin by starting a new company \u2014 it begins by pointing Centai at the fusion problem.'))
    story.append(sp(2))

    story.append(h2('Net Worth Trajectory'))
    long_h = ['Age', 'Year', 'Key Event', 'Net Worth']
    long_r = [
        ['30', '2035', 'Wakasa Labs positions Centai at fusion domain', '$10M'],
        ['33', '2038', 'Centai-assisted fusion breakthroughs create strategic value', '$50M'],
        ['35', '2040', 'Wakasa Labs raises major round; propulsion subsidiary launched', '$100M+'],
        ['38', '2043', 'Company IPO or major strategic acquisition', '$500M'],
        ['40', '2045', 'Multi-billion company; fusion progress real', '$1B\u20136B'],
        ['45', '2050', 'Category leadership in AI for science + propulsion', '$10B\u201320B'],
        ['50', '2055', 'Interstellar mission programme active', '$30B+'],
        ['55\u201360', '2060\u20132065', 'Proxima mission funded and launched', '$60B\u2013100B+'],
    ]
    cw11 = [(W-2*MARGIN)*f for f in [0.08, 0.10, 0.57, 0.25]]
    story.append(make_table(long_h, long_r, cw11))
    story.append(sp(3))

    story.append(h2('Why Fusion Through Centai, Not a Standalone Propulsion Company'))
    for item in [
        'Fusion is a materials + plasma + simulation problem as much as it is a physics problem \u2014 Centai is directly applicable',
        'Starting a propulsion company cold at age 30 requires $50M+ and a PhD team you don\'t have yet',
        'Building Centai until it has genuine scientific capability gives you leverage to partner with, invest in, or acquire fusion startups',
        'The Wakasa Labs conglomerate structure you already have allows a propulsion subsidiary under the parent \u2014 you don\'t rebuild from scratch',
        'If Centai produces a materials discovery that enables better fusion containment, Wakasa Labs becomes indispensable to the fusion industry',
    ]:
        story.append(bullet(item))
    story.append(PageBreak())

    # ======================================================
    # EVALUATION SYSTEM
    # ======================================================
    story.append(section_label('Systems'))
    story.append(h1('Evaluation System'))
    story.append(gold_rule())
    story.append(sp(2))

    story.append(body('The plan is the map. The evaluation system is what tells you whether you are actually moving. Run these consistently.'))
    story.append(sp(2))

    story.append(h2('Weekly Review (Every Friday, 30 minutes)'))
    wk_items = [
        ('Net worth check', 'Current vs last week. Is the number moving?'),
        ('3 big goals', 'Did I complete them? If not \u2014 was the goal wrong, or was I?'),
        ('Work quality', 'Rate 1\u201310. What did I ship that I am proud of?'),
        ('Energy check', 'Physical, mental, emotional. Anything below 7 needs a cause.'),
        ('Focus check', 'Hours on high-leverage vs low-leverage. Name the time wasters.'),
        ('Learning check', 'One new concept or skill this week. Can I apply it?'),
        ('Mission check', 'Did this week move me toward solving continual learning / Centai / the stars?'),
    ]
    wk_data = [[Paragraph(f'<b>{k}</b>', sTableCellL), Paragraph(v, sTableCellL)] for k, v in wk_items]
    wk_style = TableStyle([
        ('ROWBACKGROUNDS', (0,0), (-1,-1), [WHITE, LIGHT_BG]),
        ('GRID',           (0,0), (-1,-1), 0.3, LINE_GREY),
        ('TOPPADDING',     (0,0), (-1,-1), 5),
        ('BOTTOMPADDING',  (0,0), (-1,-1), 5),
        ('LEFTPADDING',    (0,0), (-1,-1), 6),
        ('RIGHTPADDING',   (0,0), (-1,-1), 6),
        ('VALIGN',         (0,0), (-1,-1), 'TOP'),
        ('LINEAFTER',      (0,0), (0,-1),  0.5, LINE_GREY),
    ])
    story.append(Table(wk_data, colWidths=[(W-2*MARGIN)*0.28, (W-2*MARGIN)*0.72], style=wk_style))
    story.append(sp(3))

    story.append(h2('Monthly Review (Last Sunday, 2 hours)'))
    mn_items = [
        ('Financial deep dive', 'Income by source, savings rate, net worth growth, annual pace. On track?'),
        ('ACSIS / Centai progress', 'Experiments run, results documented, codebase advanced, anything publishable?'),
        ('Publications pipeline', 'What is in draft, what is submitted, what is published?'),
        ('Professor / network log', 'New contacts made, existing relationships maintained, any opportunities?'),
        ('Immigration milestones', 'Which checklist items are done? What is the next action?'),
        ('Skills assessment', 'What can I do now that I couldn\'t last month? Evidence?'),
        ('Energy sustainability', 'Can I sustain this pace for another month / year / decade?'),
        ('Mission alignment', 'If I continue at this exact rate, where will I be in 10 years? Happy with that?'),
    ]
    mn_data = [[Paragraph(f'<b>{k}</b>', sTableCellL), Paragraph(v, sTableCellL)] for k, v in mn_items]
    story.append(Table(mn_data, colWidths=[(W-2*MARGIN)*0.28, (W-2*MARGIN)*0.72], style=wk_style))
    story.append(sp(3))

    story.append(h2('Quarterly Review (Every 3 Months, Half Day)'))
    qt_items = [
        ('Net worth trajectory', 'Ahead / on track / behind. Gap to annual goal. What must change?'),
        ('Income stream analysis', 'Which streams are growing? Which to kill? Which to 10x?'),
        ('Skill trajectory', 'Rate AI/ML, maths, scientific domain, communication. Fast enough?'),
        ('Portfolio quality', 'Would these projects impress a research group at CMU or MIT?'),
        ('Network quality', 'Of all connections: how many would take a call, make an intro, give honest feedback?'),
        ('Major pivot point', 'Should I change strategy? Commit to a path explicitly. Set a trigger condition for reconsideration.'),
        ('Immigration status', 'Where am I on the visa / OPT / green card timeline? Next action?'),
        ('Next quarter commitment', 'One massive focus. Two secondary priorities. What to stop. Metrics for success.'),
    ]
    qt_data = [[Paragraph(f'<b>{k}</b>', sTableCellL), Paragraph(v, sTableCellL)] for k, v in qt_items]
    story.append(Table(qt_data, colWidths=[(W-2*MARGIN)*0.28, (W-2*MARGIN)*0.72], style=wk_style))
    story.append(PageBreak())

    # ======================================================
    # MILESTONE TRACKER
    # ======================================================
    story.append(section_label('The Checklist'))
    story.append(h1('Master Milestone Tracker'))
    story.append(gold_rule())
    story.append(sp(2))
    story.append(body('This is the single page you return to. Each milestone gates the next. Nothing is optional.'))
    story.append(sp(2))

    milestones = [
        ('2025\u20132026', [
            '[ ]  Passport obtained',
            '[ ]  wakasalabs.com live',
            '[ ]  lensenwakasa.com live',
            '[ ]  GitHub organised and public',
            '[ ]  SOMA/ACSIS codebase cleaned and documented',
            '[ ]  Linear Algebra complete (MIT OCW)',
            '[ ]  Calculus I complete',
            '[ ]  First 3 technical articles published',
            '[ ]  Hydra / trading documented as a project',
            '[ ]  Notion: Mission Proxima workspace created and active',
        ]),
        ('2027', [
            '[ ]  Clinical Medicine final year in progress',
            '[ ]  Calculus II + Probability complete',
            '[ ]  6+ technical articles published',
            '[ ]  ACSIS research note / white paper written',
            '[ ]  IELTS Academic sat \u2014 score 7.0+ achieved',
            '[ ]  Professor spreadsheet: 30+ identified, 10+ contacted',
            '[ ]  Personal statement drafted',
            '[ ]  Recommendation letter requests sent (3 months notice)',
            '[ ]  10 university applications submitted (Dec\u2013Jan)',
        ]),
        ('2028 (Internship Year)', [
            '[ ]  Clinical Medicine completed and certified',
            '[ ]  COC (Certificate of Completion) obtained',
            '[ ]  Medical internship started (July 2028)',
            '[ ]  Grad school acceptance received and accepted',
            '[ ]  I-20 form received from university',
            '[ ]  SEVIS fee paid',
            '[ ]  DS-160 completed online',
            '[ ]  US Embassy interview scheduled and attended',
            '[ ]  F-1 student visa issued',
            '[ ]  Centai v1 prototype running',
            '[ ]  ACSIS paper on arXiv or submitted to conference',
        ]),
        ('2029 (Travel + Masters Start)', [
            '[ ]  Internship completed (July 2029)',
            '[ ]  Flight to US booked',
            '[ ]  University enrolled, SEVIS activated',
            '[ ]  TA or RA position secured (funded)',
            '[ ]  US bank account opened',
            '[ ]  Social Security Number obtained',
            '[ ]  Research advisor relationship established',
        ]),
        ('2030\u20132031 (Masters)', [
            '[ ]  Coursework completed with strong GPA',
            '[ ]  1+ conference paper accepted',
            '[ ]  Centai v2 architecture published or demonstrated',
            '[ ]  Wakasa Labs Delaware C-Corp registered',
            '[ ]  OPT application filed (90 days before graduation)',
            '[ ]  STEM OPT extension application prepared',
            '[ ]  Net worth: $200K\u2013400K',
        ]),
        ('2031\u20132033 (OPT / Scale)', [
            '[ ]  OPT active; STEM OPT extension approved',
            '[ ]  3\u20134 publications total (conference + preprints)',
            '[ ]  Centai generating revenue or seed-funded',
            '[ ]  O-1A evidence file being built',
            '[ ]  Net worth: $1M+',
        ]),
        ('2033\u20132035 (Wealth + Residency)', [
            '[ ]  O-1A approved',
            '[ ]  EB-2 NIW petition filed',
            '[ ]  Wakasa Labs Series A raised or significant Centai exit',
            '[ ]  Net worth: $10M',
            '[ ]  Green Card approved (or in process)',
        ]),
    ]

    for period, items in milestones:
        story.append(KeepTogether([
            h3(period),
            *[Paragraph(item, sBullet) for item in items],
            sp(2),
        ]))

    story.append(PageBreak())

    # ======================================================
    # CLOSING
    # ======================================================
    story.append(sp(6))
    story.append(gold_rule())
    story.append(sp(4))
    story.append(Paragraph('The mission never changes.', sMission))
    story.append(sp(2))
    story.append(Paragraph(
        'Build intelligence systems that accelerate scientific discovery.<br/>'
        'Use those systems to help humanity solve fusion, longevity, and propulsion.<br/>'
        'Fund and architect the mission to Proxima Centauri.',
        S('closing', fontName='Carlito', fontSize=11, leading=18, textColor=MID_GREY, alignment=TA_CENTER)
    ))
    story.append(sp(4))
    story.append(rule())
    story.append(sp(2))
    story.append(Paragraph(
        'Everything in this document is negotiable except the mission and the principles.<br/>'
        'The principles: build evidence, not potential. Make money before spending it.<br/>'
        'Evaluate ruthlessly. Adjust quickly. One day at a time, for forty years.',
        S('closing2', fontName='Carlito-Italic', fontSize=9, leading=14, textColor=MID_GREY, alignment=TA_CENTER)
    ))
    story.append(sp(4))
    story.append(Paragraph('Wakasa Labs  |  Lensen Wakasa  |  Version 2.0  |  June 2026',
                           S('footer', fontSize=8, textColor=LINE_GREY, alignment=TA_CENTER)))

    doc.build(story)
    print('Done:', path)

build()