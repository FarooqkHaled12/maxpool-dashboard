/**
 * Max Pool — Manual Translation System
 * Clean bilingual support: English / Arabic
 * No Google Translate. No layout breakage. No external dependencies.
 */

const Lang = (() => {

  const translations = {
    // Navbar
    'nav.home':      { en: 'Home',       ar: 'الرئيسية' },
    'nav.equipment': { en: 'Equipment',  ar: 'المعدات' },
    'nav.services':  { en: 'Services',   ar: 'الخدمات' },
    'nav.about':     { en: 'About Us',   ar: 'من نحن' },
    'nav.contact':   { en: 'Contact',    ar: 'تواصل معنا' },

    // Footer
    'footer.tagline':       { en: 'Premium pool infrastructure, equipment, and chemical treatments meeting the highest European Standards.', ar: 'بنية تحتية متميزة للمسابح، معدات ومواد كيميائية وفق أعلى المعايير الأوروبية.' },
    'footer.company.title': { en: 'Our Company',        ar: 'شركتنا' },
    'footer.link.home':     { en: 'Home',                ar: 'الرئيسية' },
    'footer.link.catalog':  { en: 'Equipment Catalog',  ar: 'كتالوج المعدات' },
    'footer.link.services': { en: 'Services',            ar: 'الخدمات' },
    'footer.link.about':    { en: 'About Us',            ar: 'من نحن' },
    'footer.link.contact':  { en: 'Contact Us',          ar: 'تواصل معنا' },
    'footer.contact.title': { en: 'Contact Information', ar: 'معلومات التواصل' },
    'footer.copyright':     { en: '© 2026 Max Pool. All rights reserved.', ar: '© 2026 ماكس بول. جميع الحقوق محفوظة.' },

    // Home — Hero
    'home.badge':      { en: 'European Standards. Egyptian Expertise.', ar: 'معايير أوروبية. خبرة مصرية.' },
    'home.hero.title': { en: 'Your Technical Partners in <span class="text-gradient">Aquatic Success</span>', ar: 'شركاؤك التقنيون في <span class="text-gradient">نجاح مشاريع المسابح</span>' },
    'home.hero.sub':   { en: 'Specialized providers of premium swimming pool equipment, from high-efficiency pumps to fiberglass sand filters. Supplying Zamalek Sporting Club, luxury resorts, and elite villas across Egypt.', ar: 'مزودون متخصصون في معدات المسابح الفاخرة، من المضخات عالية الكفاءة إلى فلاتر الرمل الزجاجية. نخدم نادي الزمالك الرياضي والمنتجعات الفاخرة والفيلات الراقية في جميع أنحاء مصر.' },
    'home.hero.btn1':  { en: 'Explore Equipment', ar: 'استكشف المعدات' },
    'home.hero.btn2':  { en: 'Free Consultation',  ar: 'استشارة مجانية' },

    // Home — Brands
    'home.brands.title': { en: 'Trusted Partners & Global Brands', ar: 'شركاء موثوقون وعلامات تجارية عالمية' },

    // Home — Features
    'home.features.title': { en: 'Why Choose Max Pool?', ar: 'لماذا تختار ماكس بول؟' },
    'home.features.sub':   { en: 'More than just suppliers — we are your partners in success.', ar: 'أكثر من مجرد موردين — نحن شركاؤك في النجاح.' },
    'home.f1.title': { en: 'European Standards',           ar: 'معايير أوروبية' },
    'home.f1.text':  { en: 'We strictly adhere to the highest international and European quality standards, providing durable and reliable equipment that outlasts the competition.', ar: 'نلتزم بأعلى معايير الجودة الدولية والأوروبية، ونوفر معدات متينة وموثوقة تتفوق على المنافسين.' },
    'home.f2.title': { en: 'Full-Service Operations',      ar: 'خدمات متكاملة' },
    'home.f2.text':  { en: 'From sourcing premium equipment to professional installation and meticulous maintenance, we serve luxury villas, resorts, and B2B contractors.', ar: 'من توريد المعدات الفاخرة إلى التركيب الاحترافي والصيانة الدقيقة، نخدم الفيلات الفاخرة والمنتجعات والمقاولين.' },
    'home.f3.title': { en: 'After-Sales & Technical Support', ar: 'دعم ما بعد البيع والدعم الفني' },
    'home.f3.text':  { en: "Our vision is to be Egypt's most trusted brand. Our dedicated technical experts ensure smooth operations long after the installation is complete.", ar: 'رؤيتنا أن نكون العلامة التجارية الأكثر ثقة في مصر. يضمن خبراؤنا الفنيون سير العمليات بسلاسة بعد اكتمال التركيب.' },

    // Home — Calculator
    'home.calc.badge':       { en: 'Interactive Tool',                         ar: 'أداة تفاعلية' },
    'home.calc.title':       { en: 'Calculate Your Pool Cost',                 ar: 'احسب تكلفة مسبحك' },
    'home.calc.sub':         { en: 'Plan your dream pool instantly. Enter dimensions and specifications to get a rough estimate of the construction and equipment costs.', ar: 'خطط لمسبح أحلامك فوراً. أدخل الأبعاد والمواصفات للحصول على تقدير تقريبي لتكاليف البناء والمعدات.' },
    'home.calc.li1':         { en: 'Skimmer or Overflow Systems',              ar: 'أنظمة سكيمر أو أوفرفلو' },
    'home.calc.li2':         { en: 'Concrete, Insulation & Tile finishing',    ar: 'خرسانة وعزل وتشطيب بالبلاط' },
    'home.calc.li3':         { en: 'Full European filtration equipment setup', ar: 'تجهيز كامل لمعدات الترشيح الأوروبية' },
    'home.calc.form.title':  { en: 'Dimensions & Specs',                       ar: 'الأبعاد والمواصفات' },
    'home.calc.type':        { en: 'System Type',                              ar: 'نوع النظام' },
    'home.calc.opt1':        { en: 'Standard Skimmer Pool',                    ar: 'مسبح سكيمر قياسي' },
    'home.calc.opt2':        { en: 'Luxury Overflow Pool',                     ar: 'مسبح أوفرفلو فاخر' },
    'home.calc.length':      { en: 'Length (m)',                               ar: 'الطول (م)' },
    'home.calc.width':       { en: 'Width (m)',                                ar: 'العرض (م)' },
    'home.calc.result.label':{ en: 'Estimated Budget',                         ar: 'الميزانية التقديرية' },
    'home.calc.note':        { en: '*Informational estimate only. Not a binding quote.', ar: '*تقدير استرشادي فقط. ليس عرض سعر ملزم.' },

    // Home — Portfolio
    'home.portfolio.title': { en: 'World-Class Equipment Portfolio', ar: 'محفظة معدات عالمية المستوى' },
    'home.portfolio.sub':   { en: 'We assemble the best equipment from global manufacturers and our exclusive product lines.', ar: 'نجمع أفضل المعدات من الشركات المصنعة العالمية وخطوط إنتاجنا الحصرية.' },
    'home.brand1.title':    { en: 'AstralPool (Spain)',                     ar: 'أسترال بول (إسبانيا)' },
    'home.brand1.text':     { en: 'World-renowned high-quality Spanish pumps and ultra-durable fiberglass filters.', ar: 'مضخات إسبانية عالية الجودة ذات شهرة عالمية وفلاتر زجاجية فائقة المتانة.' },
    'home.brand2.title':    { en: 'Hayward (USA) & Aqua (Italy)',           ar: 'هايوارد (أمريكا) وأكوا (إيطاليا)' },
    'home.brand2.text':     { en: 'Advanced, low-noise American technology, paired with premium Italian motor pumps designed for whirlpools and large pools.', ar: 'تقنية أمريكية متقدمة منخفضة الضوضاء، مقترنة بمضخات محرك إيطالية فاخرة مصممة للمسابح الكبيرة.' },
    'home.brand3.title':    { en: 'Max Pool Filters & Chemicals',           ar: 'فلاتر وكيماويات ماكس بول' },
    'home.brand3.text':     { en: 'Our exclusive line of heat-resistant fiberglass sand filters (Ø 400mm-900mm) and certified, pure water treatment chemicals.', ar: 'خطنا الحصري من فلاتر الرمل الزجاجية المقاومة للحرارة (Ø 400-900 مم) والمواد الكيميائية المعتمدة لمعالجة المياه.' },

    // Home — Projects
    'home.projects.label': { en: 'Our Work',              ar: 'أعمالنا' },
    'home.projects.title': { en: 'Spectacular Projects',  ar: 'مشاريع استثنائية' },
    'home.projects.sub':   { en: 'A glimpse into our landscape and swimming pool masterpieces for luxury villas and elite resorts across Egypt.', ar: 'لمحة من تحف المسابح التي نفذناها للفيلات الفاخرة والمنتجعات الراقية في جميع أنحاء مصر.' },
    'home.proj1.title':    { en: 'Luxury Villa Skimmer Pool',   ar: 'مسبح سكيمر فيلا فاخرة' },
    'home.proj1.loc':      { en: 'Marassi, North Coast',        ar: 'مراسي، الساحل الشمالي' },
    'home.proj2.title':    { en: 'Tourist Resort Overflow',     ar: 'مسبح أوفرفلو منتجع سياحي' },
    'home.proj2.loc':      { en: 'Sharm El Sheikh',             ar: 'شرم الشيخ' },
    'home.proj3.title':    { en: 'Commercial Filtration Plant', ar: 'محطة ترشيح تجارية' },
    'home.proj3.loc':      { en: 'Zamalek Sporting Club',       ar: 'نادي الزمالك الرياضي' },
    'home.projects.cta':   { en: 'Ask for a Design Quote',      ar: 'اطلب عرض سعر تصميم' },

    // Home — CTA
    'home.cta.title': { en: 'Entrust Your Pool to the Experts', ar: 'ثق بخبرائنا لمسبحك' },
    'home.cta.sub':   { en: 'Join Zamalek Sporting Club and leading resorts in the North Coast and Sharm El Sheikh. Contact us today for a robust, international-standard swimming pool setup.', ar: 'انضم إلى نادي الزمالك الرياضي والمنتجعات الرائدة في الساحل الشمالي وشرم الشيخ. تواصل معنا اليوم لإعداد مسبح بمعايير دولية.' },
    'home.cta.btn':   { en: 'Contact Us — 01006205650', ar: 'تواصل معنا — 01006205650' },

    // About
    'about.hero.eyebrow':  { en: 'About Max Pool',   ar: 'عن ماكس بول' },
    'about.hero.title':    { en: "Egypt's Most Trusted <em>Pool Partner</em>", ar: 'الشريك الأكثر ثقة <em>في مصر</em>' },
    'about.hero.sub':      { en: "Since 2009, we've been the technical backbone behind Egypt's finest pools — from luxury villas on the North Coast to Zamalek Sporting Club.", ar: 'منذ 2009، كنا العمود الفقري التقني لأفضل مسابح مصر — من الفيلات الفاخرة على الساحل الشمالي إلى نادي الزمالك الرياضي.' },
    'about.hero.btn1':     { en: 'Work With Us',  ar: 'اعمل معنا' },
    'about.hero.btn2':     { en: 'Our Services',  ar: 'خدماتنا' },
    'about.story.tag':     { en: 'Our Story',     ar: 'قصتنا' },
    'about.story.cta':     { en: 'Start Your Project', ar: 'ابدأ مشروعك' },
    'about.check1':        { en: 'Zamalek Sporting Club — full filtration system overhaul', ar: 'نادي الزمالك الرياضي — تجديد كامل لنظام الترشيح' },
    'about.check2':        { en: 'Premium resorts across North Coast & Sharm El Sheikh', ar: 'منتجعات فاخرة في الساحل الشمالي وشرم الشيخ' },
    'about.check3':        { en: 'Exclusive Max Pool fiberglass filter line (Ø 400–900mm)', ar: 'خط فلاتر ماكس بول الحصري (Ø 400–900 مم)' },
    'about.check4':        { en: 'Authorized distributor — AstralPool, Hayward, Aqua, Certikin', ar: 'موزع معتمد — أسترال بول، هايوارد، أكوا، سيرتيكين' },
    'about.badge1':        { en: 'Founded in Cairo',      ar: 'تأسست في القاهرة' },
    'about.badge2':        { en: 'Projects Completed',    ar: 'مشروع مكتمل' },
    'about.badge3':        { en: 'European Standards',    ar: 'معايير أوروبية' },
    'about.tl.tag':        { en: 'Our Journey',           ar: 'مسيرتنا' },
    'about.tl.title':      { en: 'Key Milestones',        ar: 'أبرز المحطات' },
    'about.values.sub':    { en: 'The principles that guide every decision, every installation, every client relationship.', ar: 'المبادئ التي توجه كل قرار، كل تركيب، كل علاقة مع عميل.' },
    'about.brands.label':  { en: 'Trusted Global Partners', ar: 'شركاء عالميون موثوقون' },
    'about.main.title':    { en: 'Partners in Your Success', ar: 'شركاؤك في النجاح' },
    'about.main.p1':       { en: 'At Max Pool, we consider ourselves more than just suppliers — we are your strategic technical partners in creating exceptional aquatic experiences that last for decades.', ar: 'في ماكس بول، نعتبر أنفسنا أكثر من مجرد موردين — نحن شركاؤك التقنيون الاستراتيجيون في خلق تجارب مائية استثنائية تدوم لعقود.' },
    'about.main.p2':       { en: 'From early supply runs to complex installations and meticulous after-sales support, our team serves B2B contractors, luxury resorts, and private villas with the same professional dedication.', ar: 'من عمليات التوريد الأولى إلى التركيبات المعقدة ودعم ما بعد البيع الدقيق، يخدم فريقنا المقاولين والمنتجعات الفاخرة والفيلات الخاصة بنفس المستوى من الاحترافية.' },
    'about.main.p3':       { en: 'Our portfolio features comprehensive renovations of the Zamalek Sporting Club and premium resorts across the North Coast and Sharm El Sheikh.', ar: 'تشمل محفظة أعمالنا تجديدات شاملة لنادي الزمالك الرياضي والمنتجعات الفاخرة في الساحل الشمالي وشرم الشيخ.' },
    'about.vision.title':  { en: 'Our Vision',   ar: 'رؤيتنا' },
    'about.vision.text':   { en: 'To become the absolute most trusted and reliable brand in the swimming pool industry across Egypt — setting the benchmark for quality, service, and innovation.', ar: 'أن نصبح العلامة التجارية الأكثر ثقة وموثوقية في صناعة المسابح في مصر — ونضع معيار الجودة والخدمة والابتكار.' },
    'about.mission.title': { en: 'Our Mission',  ar: 'مهمتنا' },
    'about.mission.text':  { en: 'To supply durable, energy-efficient, and international-standard pool solutions — backed by expert technical support at every stage of the project lifecycle.', ar: 'توفير حلول مسابح متينة وموفرة للطاقة وبمعايير دولية — مدعومة بدعم فني متخصص في كل مرحلة من مراحل المشروع.' },
    'about.cta.title':     { en: 'Ready to work with us?', ar: 'هل أنت مستعد للعمل معنا؟' },
    'about.cta.btn':       { en: 'Contact Us — 01006205650', ar: 'تواصل معنا — 01006205650' },

    // Products
    'products.hero.title':      { en: 'Equipment Catalog',          ar: 'كتالوج المعدات' },
    'products.hero.sub':        { en: 'Industrial-grade pumps, advanced filtration, lighting, and accessories.', ar: 'مضخات صناعية، ترشيح متقدم، إضاءة وإكسسوارات.' },
    // Products — Categories
    'products.cat.title':        { en: 'Categories',        ar: 'الأصناف' },
    'products.cat.all':          { en: 'All Categories',    ar: 'جميع الأصناف' },
    'products.cat.pumps':        { en: 'Pool Pumps',        ar: 'طلمبات حمامات السباحة' },
    'products.cat.filters':      { en: 'Pool Filters',      ar: 'فلاتر حمامات السباحة' },
    'products.cat.lights':       { en: 'Pool Lighting',     ar: 'إضاءات حمامات السباحة' },
    'products.cat.fittings':     { en: 'Pool Fittings',     ar: 'اكسسوارات حمامات السباحة' },
    'products.cat.chemicals':    { en: 'Pool Chemicals',    ar: 'كيماويات حمامات السباحة' },
    'products.cat.cleaners':     { en: 'Pool Cleaners',     ar: 'أطقم الصيانة' },
    'products.cat.testing':      { en: 'Water Testing',     ar: 'اختبار مياه حمام السباحة' },
    'products.cat.jacuzzi':      { en: 'Jacuzzi',           ar: 'جاكوزي' },
    'products.cat.heaters':      { en: 'Pool Heaters',      ar: 'سخانات حمامات السباحة' },
    'products.cat.ladders':      { en: 'Pool Ladders',      ar: 'سلم حمام السباحة' },
    'products.cat.waterfalls':   { en: 'Waterfalls',        ar: 'شلالات' },
    'products.cat.spareparts':   { en: 'Spare Parts',       ar: 'قطع غيار' },
    'products.cat.controls':     { en: 'Control Units',     ar: 'وحدات التحكم' },
    'products.cat.pipeless':     { en: 'Pipeless Filters',  ar: 'وحدة فلترة جاهزة' },
    'products.cat.transformers': { en: 'Transformers',      ar: 'محول كهرباء' },
    'products.brand.title':     { en: 'Manufacturers',              ar: 'الشركات المصنعة' },
    'products.brand.all':       { en: 'All Brands',                 ar: 'جميع الماركات' },
    'products.loading':         { en: 'Fetching catalog data...',   ar: 'جارٍ تحميل الكتالوج...' },
    'products.noresult.title':  { en: 'No products match your selection', ar: 'لا توجد منتجات تطابق اختيارك' },
    'products.noresult.sub':    { en: 'Please clear filters to view all products.', ar: 'يرجى مسح الفلاتر لعرض جميع المنتجات.' },
    'products.count':           { en: 'Displaying matched products...', ar: 'عرض المنتجات المطابقة...' },
    'products.addquote':        { en: 'Add to Quote',               ar: 'أضف للعرض' },

    // Contact
    'contact.hero.title':    { en: 'Get In Touch',   ar: 'تواصل معنا' },
    'contact.hero.sub':      { en: 'Whether you need a premium filtration system or maintenance support, our technical experts are ready to assist you.', ar: 'سواء كنت تحتاج إلى نظام ترشيح فاخر أو دعم صيانة، فريقنا الفني جاهز لمساعدتك.' },
    'contact.info.title':    { en: 'Contact Information', ar: 'معلومات التواصل' },
    'contact.ops.title':     { en: 'Main Operations',     ar: 'العمليات الرئيسية' },
    'contact.ops.text':      { en: 'Serving Egypt Nationwide<br>Zamalek, North Coast, Sharm El Sheikh', ar: 'نخدم مصر بالكامل<br>الزمالك، الساحل الشمالي، شرم الشيخ' },
    'contact.call.title':    { en: 'Call Us',              ar: 'اتصل بنا' },
    'contact.web.title':     { en: 'Website & Social',     ar: 'الموقع والتواصل الاجتماعي' },
    'contact.form.name':     { en: 'Full Name',            ar: 'الاسم الكامل' },
    'contact.form.name.ph':  { en: 'Your Name',            ar: 'اسمك' },
    'contact.form.phone':    { en: 'Phone Number',         ar: 'رقم الهاتف' },
    'contact.form.phone.ph': { en: 'e.g. 0100...',         ar: 'مثال: 0100...' },
    'contact.form.msg':      { en: 'How can we help?',     ar: 'كيف يمكننا مساعدتك؟' },
    'contact.form.msg.ph':   { en: 'I am looking for equipment for a villa pool...', ar: 'أبحث عن معدات لمسبح فيلا...' },
    'contact.form.btn':      { en: 'Send Request',         ar: 'إرسال الطلب' },
    'contact.success':       { en: 'Thank you! Your message has been safely received.', ar: 'شكراً! تم استلام رسالتك بنجاح.' },

    // About — Stats
    'about.stat1.label': { en: 'Years of Experience',     ar: 'سنة خبرة' },
    'about.stat2.label': { en: 'Installations Completed', ar: 'تركيب مكتمل' },
    'about.stat3.label': { en: 'Hotels & Resorts Served', ar: 'فندق ومنتجع' },
    'about.stat4.label': { en: 'Quality Guaranteed',      ar: 'جودة مضمونة' },

    // About — Core Values
    'about.values.eyebrow': { en: 'What Drives Us',  ar: 'ما يحركنا' },
    'about.values.title':   { en: 'Our Core Values', ar: 'قيمنا الأساسية' },
    'about.val1.title': { en: 'Quality First',       ar: 'الجودة أولاً' },
    'about.val1.text':  { en: 'Only certified, professional-grade products. No compromises on quality, ever.', ar: 'منتجات معتمدة واحترافية فقط. لا تنازل عن الجودة أبداً.' },
    'about.val2.title': { en: 'Technical Expertise', ar: 'الخبرة التقنية' },
    'about.val2.text':  { en: 'Deep knowledge of pool systems, water chemistry, and equipment sizing for every application.', ar: 'معرفة عميقة بأنظمة المسابح وكيمياء المياه وتحديد أحجام المعدات لكل تطبيق.' },
    'about.val3.title': { en: 'Reliability',         ar: 'الموثوقية' },
    'about.val3.text':  { en: 'Consistent supply, fast delivery, and dependable after-sales support across Egypt.', ar: 'توريد منتظم وتسليم سريع ودعم موثوق بعد البيع في جميع أنحاء مصر.' },
    'about.val4.title': { en: 'Customer Focus',      ar: 'التركيز على العميل' },
    'about.val4.text':  { en: "We succeed when our clients' pools perform perfectly. Your satisfaction is our benchmark.", ar: 'ننجح عندما تعمل مسابح عملائنا بشكل مثالي. رضاك هو معيارنا.' },
    'about.val5.title': { en: 'Innovation',          ar: 'الابتكار' },
    'about.val5.text':  { en: 'Continuously sourcing the latest technologies in pool efficiency, automation, and sustainability.', ar: 'نبحث باستمرار عن أحدث تقنيات كفاءة المسابح والأتمتة والاستدامة.' },
    'about.val6.title': { en: 'Integrity',           ar: 'النزاهة' },
    'about.val6.text':  { en: 'Honest advice, transparent pricing, and no upselling of unnecessary products or services.', ar: 'نصائح صادقة وأسعار شفافة وبدون بيع منتجات أو خدمات غير ضرورية.' },

    // Services page
    'services.hero.eyebrow':    { en: 'Professional Services',    ar: 'خدمات احترافية' },
    'services.hero.title':      { en: 'End-to-End Pool Services', ar: 'خدمات متكاملة للمسابح' },
    'services.hero.sub':        { en: "From initial consultation and equipment supply to professional installation, ongoing maintenance, and chemical treatment — Max Pool handles every stage of your pool's lifecycle.", ar: 'من الاستشارة الأولية وتوريد المعدات إلى التركيب الاحترافي والصيانة الدورية والمعالجة الكيميائية — ماكس بول يتولى كل مرحلة في دورة حياة مسبحك.' },
    'srv.card1.title': { en: 'Equipment Supply',      ar: 'توريد المعدات' },
    'srv.card1.sub':   { en: 'Global brands, local expertise', ar: 'ماركات عالمية، خبرة محلية' },
    'srv.card2.title': { en: 'Installation',          ar: 'التركيب' },
    'srv.card2.sub':   { en: 'Certified technicians', ar: 'فنيون معتمدون' },
    'srv.card3.title': { en: 'Maintenance',           ar: 'الصيانة' },
    'srv.card3.sub':   { en: 'Scheduled contracts',   ar: 'عقود دورية' },
    'srv.card4.title': { en: 'Chemicals',             ar: 'الكيماويات' },
    'srv.card4.sub':   { en: 'Crystal-clear water',   ar: 'مياه نقية صافية' },
    'services.list.tag':   { en: 'What We Offer',              ar: 'ما نقدمه' },
    'services.list.title': { en: 'Our Full Range of Services', ar: 'نطاق خدماتنا الكامل' },
    'services.list.sub':   { en: 'Professional pool services from supply to long-term support — all under one roof.', ar: 'خدمات مسابح احترافية من التوريد إلى الدعم طويل الأمد — تحت سقف واحد.' },    'services.process.eyebrow': { en: 'How We Work',  ar: 'كيف نعمل' },
    'services.process.title':   { en: 'Our Process',  ar: 'منهجيتنا' },
    'services.process.sub':     { en: 'A clear, structured approach from first contact to long-term support.', ar: 'نهج واضح ومنظم من أول تواصل حتى الدعم طويل الأمد.' },
    'services.clients.eyebrow': { en: 'Clients',      ar: 'عملاؤنا' },
    'services.clients.title':   { en: 'Who We Serve', ar: 'من نخدم' },
    'services.clients.sub':     { en: 'From luxury villas to five-star resorts — we serve every segment of the pool industry.', ar: 'من الفيلات الفاخرة إلى المنتجعات الخمس نجوم، نخدم كل قطاع في صناعة المسابح.' },
    'services.cta.title': { en: 'Ready to Get Started?', ar: 'هل أنت مستعد للبدء؟' },
    'services.cta.sub':   { en: "Contact our team for a free consultation. We'll assess your needs and provide a detailed proposal within 24 hours.", ar: 'تواصل مع فريقنا للحصول على استشارة مجانية. سنقيّم احتياجاتك ونقدم عرضاً تفصيلياً خلال 24 ساعة.' },

    // Product detail page
    'product.loading':         { en: 'Loading equipment specifications...', ar: 'جارٍ تحميل المواصفات التقنية...' },
    'product.specs.title':     { en: 'Technical Specifications',           ar: 'المواصفات التقنية' },
    'product.spec.cat':        { en: 'Category',                           ar: 'الفئة' },
    'product.spec.origin':     { en: 'Origin',                             ar: 'المنشأ' },
    'product.spec.origin.v':   { en: 'European / Imported Standards',      ar: 'معايير أوروبية / مستوردة' },
    'product.spec.warranty':   { en: 'Warranty',                           ar: 'الضمان' },
    'product.spec.warranty.v': { en: '1 Year Manufacturer Warranty',       ar: 'ضمان سنة من الشركة المصنعة' },
    'product.btn.quote':       { en: 'Add to Quote Cart',                  ar: 'أضف لعربة العروض' },
    'product.btn.ask':         { en: 'Ask',                                ar: 'استفسر' },
    'product.feat1.title':     { en: 'Guaranteed Quality',                 ar: 'جودة مضمونة' },
    'product.feat1.text':      { en: 'Tested against extreme pressures.',  ar: 'مختبر في ظروف الضغط القصوى.' },
    'product.feat2.title':     { en: 'Fast Fulfillment',                   ar: 'تسليم سريع' },
    'product.feat2.text':      { en: 'Available in our main Cairo warehouse.', ar: 'متوفر في مستودعنا الرئيسي بالقاهرة.' },
    'product.feat3.title':     { en: 'Technical Support',                  ar: 'دعم فني' },
    'product.feat3.text':      { en: 'Expert engineering team to assist you.', ar: 'فريق هندسي متخصص لمساعدتك.' },
  };

  // ── State ───────────────────────────────────────────────────────────────

  let _lang = localStorage.getItem('mp_lang') || 'en';

  // ── Core ────────────────────────────────────────────────────────────────

  function apply() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const t = translations[key];
      if (!t) return;
      const text = t[_lang];
      if (text === undefined) return;
      if (text.includes('<')) {
        el.innerHTML = text;
      } else {
        el.textContent = text;
      }
    });

    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      const key = el.getAttribute('data-i18n-ph');
      const t = translations[key];
      if (t && t[_lang]) el.placeholder = t[_lang];
    });

    const isAr = _lang === 'ar';
    document.documentElement.setAttribute('lang', _lang);
    document.documentElement.setAttribute('dir', isAr ? 'rtl' : 'ltr');
    document.body.style.fontFamily = isAr
      ? "'Cairo', 'Tajawal', 'Segoe UI', sans-serif"
      : '';

    if (isAr && !document.getElementById('arabic-font')) {
      const link = document.createElement('link');
      link.id = 'arabic-font';
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap';
      document.head.appendChild(link);
    }

    // Inject or remove RTL stylesheet
    let rtlStyle = document.getElementById('rtl-overrides');
    if (isAr) {
      if (!rtlStyle) {
        rtlStyle = document.createElement('style');
        rtlStyle.id = 'rtl-overrides';
        rtlStyle.textContent = `
          [dir="rtl"] .navbar-inner { flex-direction: row-reverse; }
          [dir="rtl"] .navbar-links { flex-direction: row-reverse; }
          [dir="rtl"] .hero-content { text-align: right; }
          [dir="rtl"] .hero-actions { justify-content: flex-start; flex-direction: row-reverse; }
          [dir="rtl"] .hero-badge { direction: rtl; }
          [dir="rtl"] .section-header { text-align: right; }
          [dir="rtl"] .footer-inner { flex-direction: row-reverse; }
          [dir="rtl"] .footer-links, [dir="rtl"] .footer-contact { text-align: right; }
          [dir="rtl"] .contact-grid { direction: rtl; }
          [dir="rtl"] .contact-info-card, [dir="rtl"] .contact-form label { text-align: right; }
          [dir="rtl"] .info-item { flex-direction: row-reverse; text-align: right; }
          [dir="rtl"] .about-grid { flex-direction: row-reverse; }
          [dir="rtl"] .about-text, [dir="rtl"] .vm-card { text-align: right; }
          [dir="rtl"] .vm-grid { flex-direction: row-reverse; }
          [dir="rtl"] .catalog-layout { flex-direction: row-reverse; }
          [dir="rtl"] .catalog-sidebar, [dir="rtl"] .card-content { text-align: right; }
          [dir="rtl"] .sidebar-title { flex-direction: row-reverse; }
          [dir="rtl"] .catalog-top-bar { flex-direction: row-reverse; }
          [dir="rtl"] .feature-card { text-align: right; }
          [dir="rtl"] .feature-icon { margin-left: auto; margin-right: 0; }
          [dir="rtl"] #langToggleBtn { margin-left: 0; margin-right: 12px; }
          [dir="rtl"] .cta-content-wrapper { text-align: center; }
          [dir="rtl"] .page-header { text-align: right; }
        `;
        document.head.appendChild(rtlStyle);
      }
    } else {
      if (rtlStyle) rtlStyle.remove();
    }

    const btn = document.getElementById('langToggleBtn');
    if (btn) {
      const label = btn.querySelector('#langLabel');
      if (label) label.textContent = isAr ? 'EN' : 'AR';
    }
  }

  function toggle() {
    _lang = _lang === 'en' ? 'ar' : 'en';
    localStorage.setItem('mp_lang', _lang);
    apply();
  }

  function current() { return _lang; }

  function t(key) { return translations[key]?.[_lang] ?? key; }

  return { apply, toggle, current, t };

})();

document.addEventListener('DOMContentLoaded', () => Lang.apply());

