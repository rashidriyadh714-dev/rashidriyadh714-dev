const fs = require('fs');
const path = require('path');

const PROFILE_PATH = path.join(__dirname, 'profile.json');
const OUTPUT_PATH = path.join(__dirname, 'README.md');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function slugify(text = '') {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function encode(value = '') {
  return encodeURIComponent(String(value));
}

function badge(label, color, logo, logoColor = 'white') {
  const base = `https://img.shields.io/badge/${encode(label)}-${encode(color)}?style=for-the-badge`;
  if (!logo) return `![${label}](${base})`;
  return `![${label}](${base}&logo=${encode(logo)}&logoColor=${encode(logoColor)})`;
}

function linkedBadge(label, color, logo, href, logoColor = 'white') {
  return `[${badge(label, color, logo, logoColor)}](${href})`;
}

function techBadge(tech) {
  const map = {
    'Java': ['ED8B00', 'openjdk'],
    'Python': ['3776AB', 'python'],
    'SQL': ['003B57', 'database'],
    'TypeScript': ['3178C6', 'typescript'],
    'JavaScript': ['F7DF1E', 'javascript', 'black'],
    'R (Basic)': ['276DC3', 'r'],
    'HTML': ['E34F26', 'html5'],
    'CSS': ['1572B6', 'css3'],
    'React': ['20232A', 'react'],
    'Vite': ['646CFF', 'vite'],
    'Tailwind CSS': ['0F172A', 'tailwind-css'],
    'Express.js': ['222222', 'express'],
    'Node.js': ['339933', 'nodedotjs'],
    'JavaFX': ['FF6600', 'openjdk'],
    'Maven': ['C71A36', 'apachemaven'],
    'Streamlit': ['FF4B4B', 'streamlit'],
    'Power BI': ['F2C811', 'powerbi', 'black'],
    'Power Query': ['2B579A', 'powerbi', 'white'],
    'DAX': ['F2C811', 'powerbi', 'black'],
    'MySQL': ['0B5C8E', 'mysql'],
    'SQLite': ['07405E', 'sqlite'],
    'Git': ['F05033', 'git'],
    'GitHub': ['111111', 'github'],
    'Docker': ['0C4B8E', 'docker'],
    'Scikit-learn': ['F7931E', 'scikitlearn'],
    'XGBoost': ['EC6B23', null],
    'Pandas': ['150458', 'pandas'],
    'SHAP': ['7B1FA2', null],
    'Drizzle ORM': ['C5F74F', null, 'black'],
    'React Query': ['FF4154', 'reactquery'],
    'Node': ['339933', 'nodedotjs']
  };

  const entry = map[tech];
  if (!entry) return badge(tech, '4B5563', null);
  const [color, logo, logoColor = 'white'] = entry;
  return badge(tech, color, logo, logoColor);
}

function renderBadgeRow(list = []) {
  return list.map(techBadge).join('\n');
}

function renderLinks(links = {}) {
  const items = [];
  if (links.github) items.push(linkedBadge('GitHub', '181717', 'github', links.github));
  if (links.linkedin) items.push(linkedBadge('LinkedIn', '0A66C2', 'linkedin', links.linkedin));
  if (links.email) items.push(`[${badge('Email', 'EA4335', 'gmail')}](${`mailto:${links.email}`})`);
  if (links.portfolio) items.push(linkedBadge('Portfolio', '4F46E5', null, links.portfolio));
  return items.join('\n');
}

function renderProject(project, index) {
  const highlights = (project.highlights || []).map(item => `- ${item}`).join('\n');
  const tech = (project.tech || []).join(', ');
  const links = [];
  if (project.live_demo) links.push(`🔗 **Live Demo:** ${project.live_demo}`);
  if (project.repo) links.push(`📂 **Repository:** ${project.repo}`);

  return `### ${index}) ${project.name}\n**${project.tagline || ''}**\n\n${project.type ? `**Type:** ${project.type}\n\n` : ''}**Highlights**\n${highlights}\n\n**Tech Stack**  \n${tech}\n\n${links.join('  \n')}`;
}

function renderReadme(profile) {
  const header = [
    `<h1 align="center">Hi, I'm ${profile.name} 👋</h1>`,
    `<h3 align="center">${profile.headline || ''}</h3>`,
    '',
    '<p align="center">',
    `  ${profile.summary || ''}`,
    '</p>',
    '',
    '<p align="center">',
    renderLinks(profile.links || {}),
    '</p>',
    '',
    '---',
    '',
    '## 🚀 About Me',
    profile.location ? `- 📍 ${profile.location}` : '',
    ...(profile.focus || []).map(item => `- ${item}`),
    '',
    '---',
    '',
    '## 🛠 Tech Stack',
    '',
    '### Languages',
    renderBadgeRow(profile.skills?.languages || []),
    '',
    '### Frameworks & Tools',
    renderBadgeRow(profile.skills?.frameworks_tools || []),
    '',
    '### Concepts',
    (profile.skills?.concepts || []).map(item => `- ${item}`).join('\n'),
    '',
    '---',
    '',
    '## 🌟 Featured Projects',
    '',
    ...(profile.projects || []).map((project, idx) => `${renderProject(project, idx + 1)}\n\n---\n`),
    '## 🏆 Achievements',
    ...(profile.achievements || []).map(item => `- ${item}`),
    '',
    '---',
    '',
    '## 💡 Personal Motto',
    '> Build solutions that matter.  ',
    '> Make software useful, intelligent, and meaningful.'
  ].filter(Boolean);

  return header.join('\n');
}

function main() {
  const profile = readJson(PROFILE_PATH);
  const readme = renderReadme(profile);
  fs.writeFileSync(OUTPUT_PATH, readme, 'utf8');
  console.log(`README generated successfully at ${OUTPUT_PATH}`);
}

main();
