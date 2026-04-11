const KNOWN_STATUS = new Set([
    'placed',
    'not placed',
    'na',
    'n/a',
    'in-process',
    'in process',
    'active',
    'unplaced',
    'pending',
    'yes',
    'no',
    'notplaced',
    'none',
    'not eligible',
]);

function trimOrNull(v) {
    if (v == null) return null;
    const t = String(v).trim();
    return t === '' ? null : t;
}

function isKnownStatus(s) {
    if (!s) return false;
    return KNOWN_STATUS.has(String(s).toLowerCase());
}

/**
 * Normalize company + status from DB or spreadsheet.
 * Handles: company empty while status holds employer name; swapped columns.
 */
function normalizePlacementFields(company, status) {
    let c = trimOrNull(company);
    let st = trimOrNull(status);

    if (!c && st && !isKnownStatus(st)) {
        c = st;
        st = 'Placed';
    }

    if (c && st && isKnownStatus(c) && !isKnownStatus(st)) {
        const tmp = c;
        c = st;
        st = tmp;
    }

    if (st && ['na', 'n/a'].includes(st.toLowerCase())) {
        st = 'Not Placed';
    }

    if (!st) {
        st = c ? 'Placed' : 'In-Process';
    }

    return { company: c, status: st };
}

function normalizeStudentListRow(row) {
    const { company, status } = normalizePlacementFields(row.placed_company, row.placement_status);
    return {
        ...row,
        placed_company: company,
        placement_status: status,
    };
}

function normalizePlacementRow(placement) {
    if (!placement) return placement;
    const { company, status } = normalizePlacementFields(placement.company, placement.status);
    return { ...placement, company, status };
}

/** Map spreadsheet columns to DB company + status */
function placementFromSpreadsheet(placedCompanyName, currentPlacementStatus) {
    return normalizePlacementFields(
        trimOrNull(placedCompanyName),
        trimOrNull(currentPlacementStatus)
    );
}

module.exports = {
    normalizePlacementFields,
    normalizeStudentListRow,
    normalizePlacementRow,
    placementFromSpreadsheet,
};
