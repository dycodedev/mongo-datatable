function escapeNonAlphanumeric(string) {
  return string.replace(/[\W\s]/g, '\\$&');
}

exports.escapeNonAlphanumeric = escapeNonAlphanumeric;