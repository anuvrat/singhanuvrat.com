import * as fs from 'fs';
import * as path from 'path';

const postsDir = path.join(process.cwd(), 'src/content/posts');

function detectLanguage(code: string): string {
  const trimmed = code.trim();

  // Shell/Bash patterns
  if (/^(\$|>|#!)/.test(trimmed) ||
      /\b(pip|npm|pnpm|yarn|brew|apt|yum|docker|kubectl|git|curl|wget|cd|ls|rm|mkdir|echo|export)\b/.test(trimmed) ||
      /^\s*(sudo|chmod|chown|grep|awk|sed|cat|tail|head)\b/.test(trimmed)) {
    return 'bash';
  }

  // Python patterns
  if (/\b(def |class |import |from .+ import|print\(|if __name__|self\.|\.py\b|lambda |yield |async def|await )/m.test(trimmed) ||
      /^@\w+/.test(trimmed) ||
      /:\s*$/.test(trimmed.split('\n')[0] || '')) {
    return 'python';
  }

  // SQL patterns
  if (/\b(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|FROM|WHERE|JOIN|GROUP BY|ORDER BY|HAVING)\b/i.test(trimmed)) {
    return 'sql';
  }

  // YAML patterns
  if (/^[\w-]+:\s*(\n|$)/m.test(trimmed) && /^\s{2,}[\w-]+:/m.test(trimmed)) {
    return 'yaml';
  }

  // JSON patterns
  if (/^\s*[\[{]/.test(trimmed) && /[\]}]\s*$/.test(trimmed)) {
    return 'json';
  }

  // JavaScript/TypeScript patterns
  if (/\b(const |let |var |function |=>|require\(|module\.exports|export |import .+ from)/m.test(trimmed)) {
    return 'javascript';
  }

  // Java patterns
  if (/\b(public |private |protected |class |interface |extends |implements |void |static )/m.test(trimmed) &&
      /;\s*$/.test(trimmed)) {
    return 'java';
  }

  // Go patterns
  if (/\b(func |package |import \(|type .+ struct|go |chan |defer )/m.test(trimmed)) {
    return 'go';
  }

  // Rust patterns
  if (/\b(fn |let mut |impl |pub |struct |enum |use |mod |trait )/m.test(trimmed)) {
    return 'rust';
  }

  // HCL/Terraform patterns
  if (/\b(resource |variable |output |module |provider |data )\s*"/.test(trimmed)) {
    return 'hcl';
  }

  // XML/HTML patterns
  if (/^<\?xml|^<!\w|^<\w+[^>]*>/.test(trimmed)) {
    return 'xml';
  }

  // Scala patterns
  if (/\b(val |var |def |object |trait |case class|implicit )/m.test(trimmed)) {
    return 'scala';
  }

  // Default to text for unknown
  return 'text';
}

function processPost(filePath: string): { changed: boolean; languages: string[] } {
  let content = fs.readFileSync(filePath, 'utf-8');
  const languages: string[] = [];
  let changed = false;

  // Match code blocks without language tags
  const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;

  content = content.replace(codeBlockRegex, (match, lang, code) => {
    if (lang && lang.length > 0) {
      // Already has a language tag
      languages.push(lang);
      return match;
    }

    // Detect language
    const detectedLang = detectLanguage(code);
    languages.push(detectedLang);
    changed = true;
    return '```' + detectedLang + '\n' + code + '```';
  });

  if (changed) {
    fs.writeFileSync(filePath, content);
  }

  return { changed, languages };
}

async function main() {
  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.mdx'));

  console.log('Adding language tags to code blocks...\n');

  for (const file of files) {
    const filePath = path.join(postsDir, file);
    const { changed, languages } = processPost(filePath);

    if (changed) {
      console.log(`✓ ${file}`);
      console.log(`  Languages: ${languages.join(', ')}`);
    } else if (languages.length > 0) {
      console.log(`· ${file} (already tagged: ${languages.join(', ')})`);
    } else {
      console.log(`· ${file} (no code blocks)`);
    }
  }

  console.log('\nDone!');
}

main();
