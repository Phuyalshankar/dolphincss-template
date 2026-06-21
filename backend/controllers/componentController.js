import Component from '../models/Component.js';
import Developer from '../models/Developer.js';
import crypto from 'crypto';

// Helper to verify or register a developer and validate token
const verifyDeveloper = async (username, providedSecret) => {
  if (!username) return { allowed: false, error: 'Username is required.' };
  if (!providedSecret) return { allowed: false, error: 'Authorization secret is required.' };

  const trimmedUser = username.trim();
  const trimmedSecret = providedSecret.trim();

  // 1. Global admin secret always bypasses check
  if (trimmedSecret === process.env.ADMIN_SECRET) {
    // If developer doesn't exist, we can register them using the admin secret
    let dev = await Developer.findOne({ username: trimmedUser });
    if (!dev) {
      const generatedToken = 'dp_tok_' + crypto.randomBytes(16).toString('hex');
      dev = await Developer.create({
        username: trimmedUser,
        token: generatedToken
      });
      return { allowed: true, developerToken: generatedToken, isNew: true };
    }
    return { allowed: true, developerToken: dev.token, isNew: false };
  }

  // 2. Look up developer by username
  let dev = await Developer.findOne({ username: trimmedUser });
  if (!dev) {
    return { allowed: false, error: `Developer "${trimmedUser}" is not registered. Please push with the admin secret key first to register.` };
  }

  // 3. Match developer specific token
  if (dev.token === trimmedSecret) {
    return { allowed: true, developerToken: dev.token, isNew: false };
  }

  return { allowed: false, error: 'Invalid developer token.' };
};

// ── Lucide icon name → inline SVG path map ──────────────────────────────────
// Every icon used across DolphinCSS templates is listed here.
const LUCIDE_ICONS = {
  Activity:      '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
  Bell:          '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  ChevronRight:  '<polyline points="9 18 15 12 9 6"/>',
  ChevronLeft:   '<polyline points="15 18 9 12 15 6"/>',
  ChevronDown:   '<polyline points="6 9 12 15 18 9"/>',
  ChevronUp:     '<polyline points="18 15 12 9 6 15"/>',
  Eye:           '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
  EyeOff:        '<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/>',
  Lock:          '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  Unlock:        '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>',
  Mail:          '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  Menu:          '<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>',
  Search:        '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  User:          '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  Users:         '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  X:             '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  Plus:          '<path d="M5 12h14"/><path d="M12 5v14"/>',
  Minus:         '<path d="M5 12h14"/>',
  Check:         '<path d="M20 6 9 17l-5-5"/>',
  Home:          '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  Settings:      '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
  LogOut:        '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>',
  ArrowRight:    '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  ArrowLeft:     '<path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>',
  Upload:        '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>',
  Download:      '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
  Star:          '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  Heart:         '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
  Trash:         '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>',
  Edit:          '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>',
  Save:          '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>',
  Share:         '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/>',
  Copy:          '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
  Filter:        '<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>',
  RefreshCw:     '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
  Icon:          '<circle cx="12" cy="12" r="10"/>',  // fallback generic icon
};

/** camelCase → kebab-case for CSS property names */
function camelToKebab(str) {
  return str.replace(/([A-Z])/g, (m) => '-' + m.toLowerCase());
}

/**
 * Convert a JSX style object string  { key: 'val', key2: 'val2' }
 * into a plain CSS string            "key: val; key2: val2"
 */
function parseJsxStyle(jsxStyleBody) {
  return jsxStyleBody
    .split(',')
    .map(pair => {
      const colonIdx = pair.indexOf(':');
      if (colonIdx === -1) return '';
      const key = pair.slice(0, colonIdx).trim().replace(/['"]/g, '');
      const val = pair.slice(colonIdx + 1).trim().replace(/^['"]|['"]$/g, '');
      if (!key || !val) return '';
      return `${camelToKebab(key)}: ${val}`;
    })
    .filter(Boolean)
    .join('; ');
}

/**
 * Convert JSX/React markup → plain HTML browser-renderable string.
 * Handles:
 *   • className → class
 *   • htmlFor   → for
 *   • SVG camelCase attrs
 *   • style={{ camelKey: 'val' }} → style="kebab-key: val"
 *   • Lucide icon components → inline <svg> (with correct class + style)
 */
function jsxToHtml(jsx) {
  let html = jsx;

  // ── 1. Convert style={{ ... }} → style="..." (must run BEFORE className etc.) ──
  html = html.replace(/style=\{\{([\s\S]*?)\}\}/g, (_, body) => {
    const css = parseJsxStyle(body);
    return css ? `style="${css}"` : '';
  });

  // ── 2. JSX boolean / event props to remove ──────────────────────────────────
  html = html
    .replace(/\bon[A-Z]\w+=\{[^}]*\}/g, '')   // onClick={...} etc. → remove
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '');     // {/* comments */} → remove

  // ── 3. JSX attribute renames ─────────────────────────────────────────────────
  html = html
    .replace(/\bclassName=/g, 'class=')
    .replace(/\bhtmlFor=/g, 'for=')
    .replace(/\bstrokeWidth=/g, 'stroke-width=')
    .replace(/\bstrokeLinecap=/g, 'stroke-linecap=')
    .replace(/\bstrokeLinejoin=/g, 'stroke-linejoin=')
    .replace(/\bfillRule=/g, 'fill-rule=')
    .replace(/\bclipRule=/g, 'clip-rule=')
    .replace(/\btabIndex=/g, 'tabindex=')
    .replace(/\bautoComplete=/g, 'autocomplete=')
    .replace(/\bautoFocus\b/g, 'autofocus')
    .replace(/\breadOnly\b/g, 'readonly')
    .replace(/\bdefaultValue=/g, 'value=')
    .replace(/\bdefaultChecked\b/g, 'checked')
    .replace(/\bxmlns:xlink=/g, 'xmlns:xlink=');

  // ── 4. JSX expression values: value={expr} → value="expr" ───────────────────
  // Handles: type={"text"} → type="text",  size={20} → kept for icon parsing
  html = html.replace(/=\{"([^"]*)"\}/g, '="$1"');

  // ── 5. Lucide icon components → inline <svg> with class + style ─────────────
  html = html.replace(
    /<([A-Z][a-zA-Z]+)((?:\s[^>]*)?)\s*\/>/g,
    (match, name, attrs) => {
      const paths = LUCIDE_ICONS[name];
      if (!paths) return ''; // unknown component → silently remove

      attrs = attrs || '';

      // Extract class
      const classMatch = attrs.match(/class(?:Name)?="([^"]*)"/);
      const cls = classMatch ? classMatch[1] : '';

      // Extract size
      const sizeMatch = attrs.match(/size=\{?(\d+)\}?/);
      const size = sizeMatch ? sizeMatch[1] : '20';

      // Extract already-converted style="..." (from step 1 above)
      const styleMatch = attrs.match(/style="([^"]*)"/);
      const styleAttr = styleMatch ? ` style="${styleMatch[1]}"` : '';

      const classAttr = cls ? ` class="${cls}"` : '';

      return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${classAttr}${styleAttr}>${paths}</svg>`;
    }
  );

  return html;
}

// ── Helper: generate unique componentId ──────────────────────────────────────
async function genComponentId() {
  while (true) {
    const id = `d-${Math.floor(10000 + Math.random() * 90000)}`;
    if (!(await Component.findOne({ componentId: id }))) return id;
  }
}

// ── POST /api/templates/push ─────────────────────────────────────────────────
/**
 * Push (create or update) a component version.
 *
 * Body fields:
 *   name       (required) base component name, e.g. "dolphin-login"
 *   code       (required) JSX/HTML string
 *   username   author's username, default "core"
 *   author     display name
 *   version    semver, default "1.0.0"
 *   variant    "default"|"glass"|"minimal"|"dark"|"pro", default "default"
 *   category   e.g. "forms"
 *   tags       comma-separated or array
 *   isOfficial true only for DolphinCSS Core
 *   description short description
 */
export const pushTemplate = async (ctx) => {
  try {
    const providedSecret = ctx.req.headers['x-admin-secret'] || ctx.query?.secret || ctx.body?.secret;
    const {
      name, code,
      username   = 'core',
      author     = 'DolphinCSS Core',
      version    = '1.0.0',
      variant    = 'default',
      category   = 'general',
      tags,
      isOfficial = false,
      description = '',
      isPublic,
      isPremium
    } = ctx.body || {};

    const auth = await verifyDeveloper(username, providedSecret);
    if (!auth.allowed) {
      return ctx.status(401).json({ success: false, error: auth.error });
    }

    if (!name || !code) {
      return ctx.status(400).json({ success: false, error: '`name` and `code` are required.' });
    }

    // Limit component size to 100 KB
    if (code.length > 102400) {
      return ctx.status(400).json({ success: false, error: 'Component code size exceeds the maximum limit of 100 KB.' });
    }

    const trimmedName = name.trim();
    const trimmedUser = username.trim();
    const slug        = `${trimmedUser}/${trimmedName}@${version}`;

    // Find existing doc for this exact author+name+variant+version
    let existing = await Component.findOne({
      username: trimmedUser, name: trimmedName, variant, version
    });

    const componentId = existing?.componentId || await genComponentId();
    const binaryCode  = Buffer.from(code, 'utf8');
    const tagArr      = Array.isArray(tags)
      ? tags
      : (tags ? String(tags).split(',').map(t => t.trim()).filter(Boolean) : []);

    const updates = {
      componentId, slug, name: trimmedName, variant, version,
      username: trimmedUser, author,
      isOfficial: Boolean(isOfficial),
      code: binaryCode, category, tags: tagArr, description
    };
    if (isPublic !== undefined) updates.isPublic = Boolean(isPublic);
    if (isPremium !== undefined) updates.isPremium = Boolean(isPremium);

    const component = await Component.findOneAndUpdate(
      { username: trimmedUser, name: trimmedName, variant, version },
      updates,
      { new: true, upsert: true }
    );

    console.log(`📥 ${slug} (${componentId}) saved.`);
    return ctx.status(200).json({
      success: true,
      message: `Component pushed successfully.`,
      developerToken: auth.developerToken,
      data: {
        componentId: component.componentId,
        slug:        component.slug,
        marker:      variant === 'default'
          ? trimmedName
          : `${trimmedName}--${variant}`,
        name:        component.name,
        version:     component.version,
        username:    component.username
      }
    });
  } catch (error) {
    console.error('pushTemplate error:', error);
    return ctx.status(500).json({ success: false, error: error.message });
  }
};

// ── GET /api/templates/:name ─────────────────────────────────────────────────
/**
 * Fetch and serve a component template.
 *
 * Query params:
 *   preview=true           → wrap in full HTML page (iframe preview)
 *   author=john_dev        → get specific author's version
 *   variant=glass          → get specific variant
 *   version=2.0.0          → get specific version
 *   via=vite-plugin|web    → tag download source for analytics
 */
export const getTemplate = async (ctx) => {
  try {
    const { name } = ctx.params;
    const { author, variant, version, via = 'web' } = ctx.query;

    // Resolve component using marker logic
    let component;
    if (author || variant || version) {
      // Specific version requested
      const q = { name: name.trim() };
      if (author)  q.username = author;
      if (variant) q.variant  = variant;
      if (version) q.version  = version;
      component = await Component.findOne(q)
        .sort({ isOfficial: -1, likes: -1 });
    } else {
      // Default: use resolveMarker (official → most liked)
      component = await Component.resolveMarker(name.trim());
    }

    if (!component) {
      return ctx.status(404).json({ success: false, error: `Component "${name}" not found.` });
    }

    if (!component.isPublic) {
      const providedSecret = ctx.req.headers['x-admin-secret'] || ctx.query?.secret || ctx.body?.secret;
      if (providedSecret !== process.env.ADMIN_SECRET) {
        return ctx.status(401).json({ success: false, error: `Component "${name}" is private.` });
      }
    }

    // ── Track download (async, don't await to keep response fast) ────────────
    const rawIp  = ctx.req.headers['x-forwarded-for'] || ctx.req.socket?.remoteAddress || '';
    // Simple hash for anonymisation (not storing raw IPs)
    const ipHash = rawIp.split('.').slice(0, 2).join('.') + '.x.x';

    Component.findByIdAndUpdate(component._id, {
      $inc: { downloads: 1 },
      $push: {
        downloadLog: {
          $each:  [{ ip: ipHash, via, at: new Date() }],
          $slice: -500   // keep only last 500 events
        }
      }
    }).catch(() => {});

    // Decode binary Buffer → UTF-8, then convert JSX → plain HTML
    let htmlCode = jsxToHtml(component.code.toString('utf8'));

    // If preview query parameter is passed, wrap with DolphinCSS styling
    if (ctx.query.preview === 'true') {
      const wrappedHtml = `<!DOCTYPE html>
<html lang="en" data-theme="dolphin" data-theme-mode="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="/dolphin-css.min.css">
  <style>
    html, body {
      margin: 0;
      padding: 0;
      min-height: 100vh;
      /* Rich dark ocean gradient — matches DolphinCSS glass design */
      background:
        radial-gradient(ellipse at 20% 20%, oklch(30% 0.12 240) 0%, transparent 55%),
        radial-gradient(ellipse at 80% 80%, oklch(25% 0.10 200) 0%, transparent 55%),
        oklch(13% 0.04 225);
      color-scheme: dark;
    }
    body {
      display: flex;
      justify-content: center;
      align-items: flex-start;
      padding: 2rem;
      box-sizing: border-box;
    }
    .preview-wrap {
      width: 100%;
      max-width: 680px;
    }
  </style>
</head>
<body>
  <div class="preview-wrap">
    ${htmlCode}
  </div>
</body>
</html>`;
      ctx.setHeader('Content-Type', 'text/html');
      return ctx.html(wrappedHtml);
    }

    // Return raw template HTML
    ctx.setHeader('Content-Type', 'text/html');
    return ctx.html(htmlCode);
  } catch (error) {
    console.error('Error fetching template:', error);
    return ctx.status(500).json({ success: false, error: error.message });
  }
};

// ── GET /api/templates/list ───────────────────────────────────────────────────
/**
 * List components.
 * Query: category, author, sort=likes|downloads|newest, search, page, limit
 * Returns one "best" doc per (name+variant) by default (deduped view).
 */
export const listTemplates = async (ctx) => {
  try {
    const {
      category, author, variant,
      sort     = 'downloads',
      search   = '',
      page     = 1,
      limit    = 100,
      all      = 'false'   // all=true → return every version (no dedup)
    } = ctx.query;

    const providedSecret = ctx.req.headers['x-admin-secret'] || ctx.query?.secret || ctx.body?.secret;
    const isAuthorized = providedSecret === process.env.ADMIN_SECRET;

    const filter = {};
    if (!isAuthorized) {
      filter.isPublic = true;
    } else {
      // If authorized, let them filter by isPublic/isPremium if queried
      const { visibility, premium } = ctx.query;
      if (visibility === 'private') filter.isPublic = false;
      else if (visibility === 'public') filter.isPublic = true;
      
      if (premium === 'true') filter.isPremium = true;
      else if (premium === 'false') filter.isPremium = false;
    }

    if (category) filter.category = category;
    if (author)   filter.username  = author;
    if (variant)  filter.variant   = variant;
    if (search)   filter.$or = [
      { name:        { $regex: search, $options: 'i' } },
      { tags:        { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];

    const sortMap = {
      likes:     { isOfficial: -1, likes:     -1 },
      downloads: { isOfficial: -1, downloads: -1 },
      newest:    { createdAt: -1 }
    };
    const sortOrder = sortMap[sort] || sortMap.downloads;

    const components = await Component
      .find(filter, '-code -downloadLog')
      .sort(sortOrder)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Component.countDocuments(filter);

    return ctx.status(200).json({
      success: true,
      total,
      page:   Number(page),
      data:   components
    });
  } catch (error) {
    console.error('listTemplates error:', error);
    return ctx.status(500).json({ success: false, error: error.message });
  }
};

// ── PATCH /api/templates/:id/settings ───────────────────────────────────────
export const updateTemplateSettings = async (ctx) => {
  try {
    const { id } = ctx.params;
    const providedSecret = ctx.req.headers['x-admin-secret'] || ctx.query?.secret || ctx.body?.secret;

    const {
      name, variant, version, category, tags, description, isPublic, isPremium, code
    } = ctx.body || {};

    const updates = {};
    if (name !== undefined) updates.name = name.trim();
    if (variant !== undefined) updates.variant = variant.trim();
    if (version !== undefined) updates.version = version.trim();
    if (category !== undefined) updates.category = category.trim();
    if (description !== undefined) updates.description = description.trim();
    if (isPublic !== undefined) updates.isPublic = Boolean(isPublic);
    if (isPremium !== undefined) updates.isPremium = Boolean(isPremium);
    if (code !== undefined) {
      if (code.length > 102400) {
        return ctx.status(400).json({ success: false, error: 'Component code size exceeds the maximum limit of 100 KB.' });
      }
      updates.code = Buffer.from(code, 'utf8');
    }

    if (tags !== undefined) {
      updates.tags = Array.isArray(tags)
        ? tags
        : String(tags).split(',').map(t => t.trim()).filter(Boolean);
    }

    // Resolve by MongoDB ID or by name + author + variant
    let query;
    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { _id: id };
    } else {
      query = { name: id.trim() };
      const { author, variant: qVariant } = ctx.query;
      if (author) query.username = author.trim();
      if (qVariant) query.variant = qVariant.trim();
    }

    const component = await Component.findOne(query);
    if (!component) {
      return ctx.status(404).json({ success: false, error: 'Component not found.' });
    }

    // Verify Developer authorization
    const auth = await verifyDeveloper(component.username, providedSecret);
    if (!auth.allowed) {
      return ctx.status(401).json({ success: false, error: auth.error || 'Unauthorized to modify this component.' });
    }

    // If name, variant, or version changes, regenerate slug
    if (updates.name || updates.variant || updates.version) {
      const uName = updates.name || component.name;
      const uVer = updates.version || component.version;
      component.slug = `${component.username}/${uName}@${uVer}`;
    }

    Object.assign(component, updates);
    await component.save();

    return ctx.status(200).json({
      success: true,
      message: 'Component settings updated successfully.',
      data: component
    });
  } catch (error) {
    console.error('updateTemplateSettings error:', error);
    return ctx.status(500).json({ success: false, error: error.message });
  }
};

// ── DELETE /api/templates/:id ────────────────────────────────────────────────
export const deleteTemplate = async (ctx) => {
  try {
    const { id } = ctx.params;
    const providedSecret = ctx.req.headers['x-admin-secret'] || ctx.query?.secret || ctx.body?.secret;
    let query;
    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { _id: id };
    } else {
      query = { name: id.trim() };
      const { author, variant: qVariant } = ctx.query;
      if (author) query.username = author.trim();
      if (qVariant) query.variant = qVariant.trim();
    }

    const component = await Component.findOne(query);
    if (!component) {
      return ctx.status(404).json({ success: false, error: 'Component not found.' });
    }

    // Verify Developer authorization
    const auth = await verifyDeveloper(component.username, providedSecret);
    if (!auth.allowed) {
      return ctx.status(401).json({ success: false, error: auth.error || 'Unauthorized to delete this component.' });
    }

    await Component.deleteOne({ _id: component._id });

    return ctx.status(200).json({
      success: true,
      message: `Component '${component.name}' deleted successfully.`
    });
  } catch (error) {
    console.error('deleteTemplate error:', error);
    return ctx.status(500).json({ success: false, error: error.message });
  }
};

// ── GET /api/templates/developer/token ───────────────────────────────────────
export const getDeveloperToken = async (ctx) => {
  try {
    const { username } = ctx.query;
    const providedSecret = ctx.req.headers['x-admin-secret'] || ctx.query?.secret;

    const auth = await verifyDeveloper(username, providedSecret);
    if (!auth.allowed) {
      return ctx.status(401).json({ success: false, error: auth.error || 'Unauthorized.' });
    }

    return ctx.status(200).json({
      success: true,
      username,
      token: auth.developerToken
    });
  } catch (error) {
    return ctx.status(500).json({ success: false, error: error.message });
  }
};

// ── GET /api/templates/:name/details ─────────────────────────────────────────
export const getComponentDetails = async (ctx) => {
  try {
    const { name } = ctx.params;
    const { author, variant, version } = ctx.query;

    const q = { name: name.trim() };
    if (author)  q.username = author;
    if (variant) q.variant  = variant;
    if (version) q.version  = version;

    const component = await Component
      .findOne(q)
      .sort({ isOfficial: -1, likes: -1 })
      .select('-downloadLog');

    if (!component) {
      return ctx.status(404).json({ success: false, error: `Component "${name}" not found.` });
    }

    return ctx.status(200).json({
      success: true,
      data: {
        id:          component._id,
        componentId: component.componentId,
        slug:        component.slug,
        name:        component.name,
        variant:     component.variant,
        version:     component.version,
        username:    component.username,
        author:      component.author,
        isOfficial:  component.isOfficial,
        code:        component.code.toString('utf8'),
        category:    component.category,
        tags:        component.tags,
        description: component.description,
        likes:       component.likes,
        shares:      component.shares,
        downloads:   component.downloads,
        comments:    component.comments,
        createdAt:   component.createdAt,
        updatedAt:   component.updatedAt
      }
    });
  } catch (error) {
    console.error('getComponentDetails error:', error);
    return ctx.status(500).json({ success: false, error: error.message });
  }
};

// ── GET /api/templates/:name/versions ────────────────────────────────────────
/** List all versions of a component across all authors & variants */
export const getVersions = async (ctx) => {
  try {
    const { name } = ctx.params;
    const versions = await Component
      .find({ name: name.trim(), isPublic: true }, '-code -downloadLog -comments')
      .sort({ isOfficial: -1, likes: -1, downloads: -1 });

    return ctx.status(200).json({ success: true, total: versions.length, data: versions });
  } catch (error) {
    return ctx.status(500).json({ success: false, error: error.message });
  }
};

// ── GET /api/templates/:name/analytics ───────────────────────────────────────
/** Download trend for the last 7 days, broken by via source */
export const getAnalytics = async (ctx) => {
  try {
    const { name } = ctx.params;
    const component = await Component
      .findOne({ name: name.trim() })
      .sort({ isOfficial: -1, downloads: -1 })
      .select('name downloads likes shares comments downloadLog');

    if (!component) {
      return ctx.status(404).json({ success: false, error: 'Not found.' });
    }

    // Build last-7-day daily breakdown
    const now   = Date.now();
    const days  = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now - i * 864e5);
      return d.toISOString().slice(0, 10);
    }).reverse();

    const counts = {};
    days.forEach(d => { counts[d] = { web: 0, 'vite-plugin': 0, api: 0, total: 0 }; });

    component.downloadLog.forEach(ev => {
      const day = ev.at.toISOString().slice(0, 10);
      if (counts[day]) {
        counts[day][ev.via] = (counts[day][ev.via] || 0) + 1;
        counts[day].total++;
      }
    });

    return ctx.status(200).json({
      success:   true,
      name:      component.name,
      totals:    { downloads: component.downloads, likes: component.likes, shares: component.shares, comments: component.comments.length },
      daily:     days.map(d => ({ date: d, ...counts[d] }))
    });
  } catch (error) {
    return ctx.status(500).json({ success: false, error: error.message });
  }
};

// ── POST /api/templates/:name/like ───────────────────────────────────────────
export const likeComponent = async (ctx) => {
  try {
    const { name } = ctx.params;
    const { author, variant } = ctx.query;
    const q = { name: name.trim() };
    if (author)  q.username = author;
    if (variant) q.variant  = variant;

    const component = await Component.findOneAndUpdate(
      q,
      { $inc: { likes: 1 } },
      { new: true, sort: { isOfficial: -1, downloads: -1 } }
    );
    if (!component) return ctx.status(404).json({ success: false, error: 'Not found.' });
    return ctx.status(200).json({ success: true, likes: component.likes });
  } catch (error) {
    return ctx.status(500).json({ success: false, error: error.message });
  }
};

// ── POST /api/templates/:name/share ──────────────────────────────────────────
export const shareComponent = async (ctx) => {
  try {
    const { name } = ctx.params;
    const q = { name: name.trim() };
    if (ctx.query.author)  q.username = ctx.query.author;
    if (ctx.query.variant) q.variant  = ctx.query.variant;

    const component = await Component.findOneAndUpdate(
      q,
      { $inc: { shares: 1 } },
      { new: true, sort: { isOfficial: -1, downloads: -1 } }
    );
    if (!component) return ctx.status(404).json({ success: false, error: 'Not found.' });
    return ctx.status(200).json({ success: true, shares: component.shares });
  } catch (error) {
    return ctx.status(500).json({ success: false, error: error.message });
  }
};

// ── POST /api/templates/:name/comment ────────────────────────────────────────
export const addComment = async (ctx) => {
  try {
    const { name } = ctx.params;
    const { author = 'Anonymous', username = '', text } = ctx.body || {};

    if (!text?.trim()) {
      return ctx.status(400).json({ success: false, error: 'Comment text is required.' });
    }

    const component = await Component.findOneAndUpdate(
      { name: name.trim() },
      { $push: { comments: { author: author.trim() || 'Anonymous', username, text: text.trim(), createdAt: new Date() } } },
      { new: true, sort: { isOfficial: -1, downloads: -1 } }
    );
    if (!component) return ctx.status(404).json({ success: false, error: 'Not found.' });
    return ctx.status(200).json({ success: true, comments: component.comments });
  } catch (error) {
    return ctx.status(500).json({ success: false, error: error.message });
  }
};
