import mongoose from 'mongoose';

// ── Comment sub-schema ───────────────────────────────────────────────────────
const commentSchema = new mongoose.Schema({
  author:    { type: String, default: 'Anonymous' },
  username:  { type: String, default: '' },
  text:      { type: String, required: true },
  createdAt: { type: Date,   default: Date.now }
});

// ── Download event (lightweight per-use tracking) ────────────────────────────
const downloadEventSchema = new mongoose.Schema({
  ip:        { type: String, default: '' },   // hashed IP (anonymized)
  via:       { type: String, default: 'web' },// 'web' | 'vite-plugin' | 'api'
  at:        { type: Date,   default: Date.now }
}, { _id: false });

// ── Main Component schema ────────────────────────────────────────────────────
const componentSchema = new mongoose.Schema({

  // ── Identity ──────────────────────────────────────────────────────────────
  componentId: {
    type:     String,
    required: true,
    unique:   true,
    index:    true   // e.g. "d-82341"
  },

  /**
   * Slug = unique human-readable key
   * Format:  username/name@version  OR  core/name@version (for official)
   * Example: "john_dev/dolphin-login@2.0.0"
   *          "core/dolphin-login@1.0.0"
   */
  slug: {
    type:   String,
    unique: true,
    index:  true
  },

  // ── Component name + variant ──────────────────────────────────────────────
  name: {
    type:     String,
    required: true,
    index:    true   // e.g. "dolphin-login"
  },

  /**
   * Variant: optional visual style variation of the same component.
   * e.g. "default" | "glass" | "minimal" | "dark" | "pro"
   * Marker syntax: dolphin-login--glass
   */
  variant: {
    type:    String,
    default: 'default'
  },

  // ── Versioning ────────────────────────────────────────────────────────────
  version: {
    type:    String,
    default: '1.0.0'   // semver
  },

  // ── Author ────────────────────────────────────────────────────────────────
  username: {
    type:    String,
    default: 'core',   // "core" = DolphinCSS official
    index:   true
  },

  author: {
    type:    String,
    default: 'DolphinCSS Core'
  },

  // ── Official flag ─────────────────────────────────────────────────────────
  /**
   * isOfficial = true  → DolphinCSS Core team verified
   * Used for default marker resolution (dolphin-login → official version)
   */
  isOfficial: {
    type:    Boolean,
    default: false,
    index:   true
  },

  isPublic: {
    type:    Boolean,
    default: true
  },

  isPremium: {
    type:    Boolean,
    default: false
  },

  // ── Code ──────────────────────────────────────────────────────────────────
  code: {
    type:     Buffer,   // JSX stored as binary UTF-8
    required: true
  },

  // ── Metadata ──────────────────────────────────────────────────────────────
  category: {
    type:    String,
    default: 'general',
    index:   true
  },

  tags: {
    type:    [String],
    default: []
  },

  description: {
    type:    String,
    default: ''
  },

  // ── Engagement stats ──────────────────────────────────────────────────────
  likes: {
    type:    Number,
    default: 0
  },

  shares: {
    type:    Number,
    default: 0
  },

  /**
   * downloads = total times the template was fetched by:
   *   - vite-plugin (auto-inject)
   *   - web preview (iframe)
   *   - direct API call
   */
  downloads: {
    type:    Number,
    default: 0,
    index:   true
  },

  // Lightweight recent download log (last 500 events, capped)
  downloadLog: {
    type:    [downloadEventSchema],
    default: []
  },

  comments: [commentSchema]

}, {
  timestamps: true   // createdAt, updatedAt auto-managed
});

// ── Compound indexes for multi-author versioning ─────────────────────────────

// One version per author per component+variant
componentSchema.index(
  { username: 1, name: 1, variant: 1, version: 1 },
  { unique: true }
);

// Quick "find best official" query
componentSchema.index({ name: 1, isOfficial: -1, likes: -1 });

// Browse by category sorted by downloads
componentSchema.index({ category: 1, downloads: -1 });

// ── Static helper: resolve the "best" component for a marker ─────────────────
componentSchema.statics.resolveMarker = async function(markerName) {
  /**
   * Marker syntax:
   *   dolphin-login              → best official, else top liked
   *   dolphin-login--glass       → best "glass" variant
   *   dolphin-login--john_dev    → john_dev's version
   *   dolphin-login--glass--john → john's glass variant
   */
  let baseName = markerName;
  let variant  = 'default';
  let username = null;

  const parts = markerName.split('--');
  if (parts.length >= 2) {
    baseName = parts[0];
    // Determine if second part is a variant keyword or a username
    const KNOWN_VARIANTS = ['glass', 'minimal', 'dark', 'pro', 'light', 'gradient', 'outline'];
    if (KNOWN_VARIANTS.includes(parts[1])) {
      variant  = parts[1];
      username = parts[2] || null;
    } else {
      username = parts[1];
    }
  }

  const query = { name: baseName, variant, isPublic: true };
  if (username) query.username = username;

  // Priority: official → most likes → most downloads → newest
  const doc = await this.findOne(query)
    .sort({ isOfficial: -1, likes: -1, downloads: -1, createdAt: -1 })
    .select('-downloadLog');

  return doc;
};

const Component = mongoose.model('Component', componentSchema);
export default Component;
