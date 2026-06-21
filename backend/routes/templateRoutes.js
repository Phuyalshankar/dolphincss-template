import { createDolphinRouter } from 'dolphin-server-modules/router';
import { 
  pushTemplate, 
  getTemplate, 
  listTemplates, 
  getComponentDetails,
  getVersions,
  getAnalytics,
  likeComponent, 
  shareComponent, 
  addComment,
  updateTemplateSettings,
  deleteTemplate,
  getDeveloperToken
} from '../controllers/componentController.js';

const router = createDolphinRouter();

// ── Write & Edit ──────────────────────────────────────────────────────────────
router.post('/push', pushTemplate);
router.patch('/:id/settings', updateTemplateSettings);
router.delete('/:id', deleteTemplate);

// ── List & search ─────────────────────────────────────────────────────────────
// GET /api/templates/list?category=forms&sort=downloads&search=login&page=1
router.get('/list', listTemplates);

// ── Developer token details ───────────────────────────────────────────────────
router.get('/developer/token', getDeveloperToken);

// ── Single component (by marker name) ────────────────────────────────────────
// GET /api/templates/dolphin-login                        → best official
// GET /api/templates/dolphin-login?author=john&variant=glass
// GET /api/templates/dolphin-login?preview=true&via=web
router.get('/:name', getTemplate);

// ── Metadata & versioning ─────────────────────────────────────────────────────
router.get('/:name/details',   getComponentDetails);  // full details + code
router.get('/:name/versions',  getVersions);          // all authors/variants
router.get('/:name/analytics', getAnalytics);         // 7-day download trend

// ── Engagement ────────────────────────────────────────────────────────────────
router.post('/:name/like',    likeComponent);
router.post('/:name/share',   shareComponent);
router.post('/:name/comment', addComment);

export default router;
