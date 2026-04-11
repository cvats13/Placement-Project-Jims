/**
 * Shape gap row for profile API: omit entirely when student has no gap year.
 * Avoids sending has_gap: 0 (frontend/React pitfalls) and strips placeholder reasons.
 */
function normalizeGapsForProfile(row) {
    if (!row) return null;

    const raw = row.has_gap;
    const hasGap =
        raw === 1 ||
        raw === true ||
        String(raw) === '1' ||
        (typeof raw === 'string' && raw.toLowerCase() === 'yes');

    if (!hasGap) return null;

    let reason = row.reason != null ? String(row.reason).trim() : '';
    const isPlaceholder =
        !reason ||
        /^n\/?a$/i.test(reason) ||
        reason === '-' ||
        reason === '—' ||
        reason.toLowerCase() === 'none';

    return {
        has_gap: true,
        reason: isPlaceholder ? null : reason,
    };
}

module.exports = { normalizeGapsForProfile };
