import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding the database with realistic demo content (Non-destructive mode)...')

  // 1. Admin
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin123!', 10)
  await prisma.admin.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@msnacl.com' },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@msnacl.com',
      password: hashedPassword,
      name: 'Super Admin',
      role: 'superadmin',
    },
  })

  // 2. SiteSetting (Only create if no settings exist at all)
  const existingSetting = await prisma.siteSetting.findFirst()
  if (!existingSetting) {
    await prisma.siteSetting.create({
      data: {
        companyName: "MSN ACL",
        phone: "01751323936",
        email: "customercare@msnacl.com",
        address: "58, Sabujbag, Dhaka, Bangladesh",
        mapEmbedUrl: "https://www.google.com/maps?q=58,+Sabujbag,+Dhaka,+Bangladesh&output=embed",
        footerText: "Leading the future of multidisciplinary consulting, engineering, and sustainable development.",
      }
    })
  }

  // 3. HeroSlide
  const heroSlides = [
    { title: "Engineering a Sustainable Future", subtitle: "Delivering world-class infrastructure and environmental solutions across the globe.", imageUrl: "https://images.unsplash.com/photo-1541888081682-13bfbb0bc2ab?auto=format&fit=crop&w=1600&q=80", ctaText: "Explore Projects", ctaLink: "/projects", order: 0, isPublished: true },
    { title: "Pioneering Water Resource Management", subtitle: "Advanced engineering solutions for clean water supply, sanitation, and conservation.", imageUrl: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=1600&q=80", ctaText: "Our Services", ctaLink: "/projects", order: 1, isPublished: true },
    { title: "Innovating Power & Energy Networks", subtitle: "Building resilient and renewable energy infrastructure for tomorrow's communities.", imageUrl: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1600&q=80", ctaText: "Discover More", ctaLink: "/projects", order: 2, isPublished: true }
  ]
  for (const slide of heroSlides) {
    const exists = await prisma.heroSlide.findFirst({ where: { title: slide.title } })
    if (!exists) await prisma.heroSlide.create({ data: slide })
  }

  // 4. Service
  const services = [
    { title: "Water Supply & Sanitation", description: "Comprehensive planning, design, and implementation of large-scale water treatment and distribution systems to ensure clean access for urban and rural populations.", iconUrl: "https://placehold.co/100x100/1a365d/ffffff?text=Water", imageUrl: "https://images.unsplash.com/photo-1590480370425-4b35e07bd629?auto=format&fit=crop&w=800&q=80", order: 0, isPublished: true },
    { title: "Transportation Infrastructure", description: "Expert engineering and strategic oversight for highways, bridges, and regional transit systems that connect communities and drive economic growth.", iconUrl: "https://placehold.co/100x100/1a365d/ffffff?text=Transit", imageUrl: "https://images.unsplash.com/photo-1469045763923-28b9d8dcfaec?auto=format&fit=crop&w=800&q=80", order: 1, isPublished: true },
    { title: "Environmental & Social Impact", description: "Rigorous environmental assessments and safeguard policies to ensure our development projects meet international sustainability and compliance standards.", iconUrl: "https://placehold.co/100x100/1a365d/ffffff?text=Eco", imageUrl: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=800&q=80", order: 2, isPublished: true }
  ]
  for (const svc of services) {
    const exists = await prisma.service.findFirst({ where: { title: svc.title } })
    if (!exists) await prisma.service.create({ data: svc })
  }

  // 5. Stat
  const stats = [
    { label: "Completed Projects", value: 120, suffix: "+", order: 0 },
    { label: "Ongoing Projects", value: 35, suffix: "+", order: 1 },
    { label: "Countries Served", value: 15, suffix: "+", order: 2 },
    { label: "Years in Business", value: 20, suffix: "+", order: 3 },
  ]
  for (const st of stats) {
    const exists = await prisma.stat.findFirst({ where: { label: st.label } })
    if (!exists) await prisma.stat.create({ data: st })
  }

  // 6. Project
  const projects = [
    {
      title: "Khulna Division Water Treatment Plant Upgrade",
      description: "Modernization of regional water supply infrastructure to serve 2.5 million residents.",
      content: "<p>The Khulna Division Water Treatment Plant Upgrade is a flagship project focused on overhauling an aging municipal water distribution system. Our team led the comprehensive feasibility study, environmental impact assessment, and the final structural design.</p><p>By implementing advanced filtration technologies and automated monitoring systems, the upgraded plant will increase daily output by 40% while significantly reducing power consumption. Social safeguard measures were strictly adhered to during the planning phase.</p><p>This initiative not only ensures clean drinking water for over 2.5 million residents but also reinforces our commitment to sustainable urbanization in South Asia.</p>",
      imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356fce?auto=format&fit=crop&w=1200&q=80",
      gallery: JSON.stringify(["https://images.unsplash.com/photo-1616423640778-28d1b53229bd?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1531834685032-c34bf0d84c77?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1580982327559-c1202864ee05?auto=format&fit=crop&w=800&q=80"]),
      location: "Khulna, Bangladesh",
      status: "ongoing",
      isFlagship: true,
      order: 0,
      isPublished: true,
    },
    {
      title: "Nairobi Regional Highway Expansion",
      description: "A comprehensive infrastructure development connecting major economic zones in East Africa.",
      content: "<p>The Nairobi Regional Highway Expansion project involves the design and construction supervision of a 150-kilometer major arterial route. This crucial infrastructure connects key industrial hubs and significantly reduces logistics costs across the region.</p><p>Our engineering experts managed the intricate topographical surveys, soil mechanics analysis, and structural integrity designs for multiple bridges along the route. We also successfully navigated complex social relocation requirements, adhering to World Bank standards.</p><p>Upon completion, the highway is projected to reduce travel time by 60% and spur local economic development in previously isolated districts.</p>",
      imageUrl: "https://images.unsplash.com/photo-1548625361-ec9962e70df4?auto=format&fit=crop&w=1200&q=80",
      gallery: JSON.stringify(["https://images.unsplash.com/photo-1469045763923-28b9d8dcfaec?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1518175960017-76a0fb4fdf12?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=800&q=80"]),
      location: "Nairobi, Kenya",
      status: "abroad",
      isFlagship: true,
      order: 1,
      isPublished: true,
    },
    {
      title: "Dhaka Metro Rail Electrification Supervision",
      description: "Technical oversight for the power and energy systems of the new metropolitan transit network.",
      content: "<p>MSN ACL was contracted to provide rigorous technical supervision for the electrification phase of the Dhaka Metro Rail project. This assignment required high-level expertise in urban power distribution and safety compliance.</p><p>Our consultants worked alongside international contractors to ensure the integration of reliable substations, overhead catenary systems, and emergency backup power solutions. We conducted exhaustive testing and commissioning protocols.</p><p>The successful execution of this project highlights our capability in handling large-scale, high-stakes public transportation infrastructure within densely populated urban environments.</p>",
      imageUrl: "https://images.unsplash.com/photo-1506462945848-ac8ea6f609cc?auto=format&fit=crop&w=1200&q=80",
      gallery: JSON.stringify(["https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1542456485-64500ea1e847?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80"]),
      location: "Dhaka, Bangladesh",
      status: "completed",
      isFlagship: false,
      order: 2,
      isPublished: true,
    }
  ]
  for (const proj of projects) {
    const exists = await prisma.project.findFirst({ where: { title: proj.title } })
    if (!exists) await prisma.project.create({ data: proj })
  }

  // 7. Client
  const clients = [
    { name: "Ministry of Local Government, Rural Development and Co-operatives", logoUrl: "https://placehold.co/200x100/f3f4f6/4b5563?text=Government+Ministry", order: 0, isPublished: true },
    { name: "Bangladesh Water Development Board", logoUrl: "https://placehold.co/200x100/f3f4f6/4b5563?text=BWDB", order: 1, isPublished: true },
    { name: "Kenya National Highways Authority", logoUrl: "https://placehold.co/200x100/f3f4f6/4b5563?text=KeNHA", order: 2, isPublished: true },
  ]
  for (const cli of clients) {
    const exists = await prisma.client.findFirst({ where: { name: cli.name } })
    if (!exists) await prisma.client.create({ data: cli })
  }

  // 8. FundingAgency
  const agencies = [
    { name: "Asian Development Bank (ADB)", logoUrl: "https://placehold.co/200x100/e0e7ff/3730a3?text=ADB", order: 0, isPublished: true },
    { name: "World Bank Group", logoUrl: "https://placehold.co/200x100/e0e7ff/3730a3?text=World+Bank", order: 1, isPublished: true },
    { name: "Japan International Cooperation Agency (JICA)", logoUrl: "https://placehold.co/200x100/e0e7ff/3730a3?text=JICA", order: 2, isPublished: true },
  ]
  for (const ag of agencies) {
    const exists = await prisma.fundingAgency.findFirst({ where: { name: ag.name } })
    if (!exists) await prisma.fundingAgency.create({ data: ag })
  }

  // 9. NewsPost (Upsert by slug)
  const newsPosts = [
    {
      title: "MSN ACL Completes Feasibility Study for Regional Water Supply Project",
      slug: "msn-acl-completes-feasibility-study-regional-water-supply",
      excerpt: "Our team successfully concluded a comprehensive 8-month feasibility study addressing critical water shortage issues in the southern coastal belt.",
      content: "<p>MSN ACL is proud to announce the successful submission of the final feasibility report for the Southern Coastal Water Supply Initiative. This project, commissioned earlier this year, aims to address the severe salinity and water scarcity challenges facing coastal communities.</p><p>Our multidisciplinary team of hydro-geologists, environmental scientists, and civil engineers conducted extensive fieldwork, testing over 50 potential aquifer sites. The proposed infrastructure model combines deep-tube well networks with advanced desalination units, designed to be resilient against rising sea levels.</p><p>The study has been highly commended by the financing partners and local government authorities. We look forward to proceeding to the detailed design and implementation phase in the coming year.</p>",
      coverImage: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80",
      order: 0,
      isPublished: true,
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
    },
    {
      title: "Expanding Our Expertise: New Environmental Safeguard Division",
      slug: "expanding-expertise-new-environmental-safeguard-division",
      excerpt: "To meet growing international compliance standards, MSN ACL has formally launched a dedicated Environmental & Social Safeguard Division.",
      content: "<p>As global infrastructure projects increasingly prioritize sustainability and social responsibility, MSN ACL has taken a proactive step by launching a dedicated Environmental & Social Safeguard Division. This new unit consolidates our existing expertise and brings in specialized international talent.</p><p>The division will focus exclusively on Environmental Impact Assessments (EIA), Resettlement Action Plans (RAP), and long-term sustainability monitoring for all our major engineering projects. This ensures our clients remain fully compliant with the stringent requirements set by agencies like the World Bank and ADB.</p><p>We believe that modern engineering must work in harmony with the environment and local communities, and this expansion solidifies our commitment to that philosophy.</p>",
      coverImage: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1200&q=80",
      order: 1,
      isPublished: true,
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45),
    },
    {
      title: "Awarded Design Consultancy for National Highway Bridge",
      slug: "awarded-design-consultancy-national-highway-bridge",
      excerpt: "MSN ACL has secured the lead consultancy contract for the structural design of the upcoming 2.4km suspension bridge over the Meghna River.",
      content: "<p>Following a highly competitive international bidding process, MSN ACL has been awarded the lead design and consultancy contract for the new Meghna River suspension bridge. This 2.4-kilometer structure will form a crucial link in the national highway network.</p><p>Our engineering team will be responsible for the complete structural design, wind-tunnel testing analysis, and foundation engineering in challenging riverbed conditions. We are partnering with international experts to leverage the latest in bridge design technology.</p><p>This landmark project represents a significant milestone for our structural engineering department and demonstrates our capacity to handle mega-infrastructure design at the highest level.</p>",
      coverImage: "https://images.unsplash.com/photo-1494022299300-899b96e49893?auto=format&fit=crop&w=1200&q=80",
      order: 2,
      isPublished: true,
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 110),
    }
  ]
  for (const news of newsPosts) {
    await prisma.newsPost.upsert({
      where: { slug: news.slug },
      update: {},
      create: news,
    })
  }

  // 10. GlobalPresence
  const presence = [
    { country: "Bangladesh", lat: 23.8103, lng: 90.4125, note: "Headquarters & Primary Operations", order: 0 },
    { country: "Nepal", lat: 27.7172, lng: 85.3240, note: "Regional Office - Hydropower Consulting", order: 1 },
    { country: "Kenya", lat: -1.2921, lng: 36.8219, note: "East Africa Branch - Infrastructure Projects", order: 2 },
  ]
  for (const p of presence) {
    const exists = await prisma.globalPresence.findFirst({ where: { country: p.country } })
    if (!exists) await prisma.globalPresence.create({ data: p })
  }

  // 11. TeamMember
  const members = [
    { name: "Engr. MD. Shafiqul Islam", designation: "Managing Director & Lead Engineer", photoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80", bio: "With over 25 years of experience in civil infrastructure, Engr. Shafiqul has led some of the largest urban development projects in the region.", order: 0, isPublished: true },
    { name: "Dr. Farhana Ahmed", designation: "Head of Environmental Compliance", photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80", bio: "Dr. Ahmed oversees all environmental and social safeguard policies for MSN ACL. Her extensive research in sustainable hydrology has been instrumental in our projects globally.", order: 1, isPublished: true },
    { name: "Syed Kamrul Hasan", designation: "Chief Project Coordinator", photoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80", bio: "Syed brings a wealth of international project management expertise to the team. He ensures seamless coordination between our engineering units, external contractors, and international funding agencies.", order: 2, isPublished: true }
  ]
  for (const m of members) {
    const exists = await prisma.teamMember.findFirst({ where: { name: m.name } })
    if (!exists) await prisma.teamMember.create({ data: m })
  }

  // 12. JobPosting
  const jobs = [
    { title: "Civil Engineer — Water Resources", department: "Engineering Design", location: "Dhaka, Bangladesh", deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), description: "<p>We are seeking an experienced Civil Engineer specializing in Water Resources to join our dynamic design team.</p>", applyEmail: "customercare@msnacl.com", isPublished: true },
    { title: "Environmental Compliance Officer", department: "Environmental Safeguards", location: "Dhaka / Field Sites", deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15), description: "<p>MSN ACL is hiring an Environmental Compliance Officer to monitor and enforce sustainability protocols across our active construction sites.</p>", applyEmail: "customercare@msnacl.com", isPublished: true },
    { title: "Project Coordinator (International Projects)", department: "Project Management", location: "Dhaka / Nairobi", deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45), description: "<p>We require a highly organized Project Coordinator to support our expanding portfolio of international infrastructure projects.</p>", applyEmail: "customercare@msnacl.com", isPublished: true }
  ]
  for (const j of jobs) {
    const exists = await prisma.jobPosting.findFirst({ where: { title: j.title } })
    if (!exists) await prisma.jobPosting.create({ data: j })
  }

  // 13. Policy
  const policies = [
    { title: "Code of Conduct & Corporate Ethics", fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", order: 0 },
    { title: "Environmental & Social Safeguard Policy", fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", order: 1 },
    { title: "Anti-Corruption and Bribery Policy", fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", order: 2 },
  ]
  for (const pol of policies) {
    const exists = await prisma.policy.findFirst({ where: { title: pol.title } })
    if (!exists) await prisma.policy.create({ data: pol })
  }

  // 14. SocialLink
  const socials = [
    { platform: "facebook", url: "https://facebook.com/msnacl.official", order: 0 },
    { platform: "linkedin", url: "https://linkedin.com/company/msn-acl", order: 1 },
    { platform: "whatsapp", url: "https://wa.me/8801751323936", order: 2 },
  ]
  for (const soc of socials) {
    const exists = await prisma.socialLink.findFirst({ where: { platform: soc.platform } })
    if (!exists) await prisma.socialLink.create({ data: soc })
  }

  // 15. PageHeader (Upsert by pageKey)
  const pageHeaders = [
    { pageKey: "about-us", title: "About MSN ACL", subtitle: "Discover our story, our mission, and the brilliant minds driving innovation." },
    { pageKey: "projects", title: "Our Projects", subtitle: "Explore our diverse portfolio of engineering and consulting excellence across the globe." },
    { pageKey: "career", title: "Join Our Team", subtitle: "Build your career with us. Explore exciting opportunities and help shape the future." },
    { pageKey: "our-policies", title: "Our Policies", subtitle: "Review our company policies, compliance standards, and operational guidelines." },
    { pageKey: "contact-us", title: "Contact Us", subtitle: "Get in touch with our team. We'd love to hear from you and discuss how we can help." },
    { pageKey: "news", title: "News & Insights", subtitle: "Stay updated with our latest industry insights, company news, and expert perspectives." }
  ]
  for (const ph of pageHeaders) {
    await prisma.pageHeader.upsert({
      where: { pageKey: ph.pageKey },
      update: {},
      create: ph,
    })
  }

  console.log('Seed completed successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
