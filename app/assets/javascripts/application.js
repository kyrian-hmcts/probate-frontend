/* global $ */
/* global jQuery */
/* global GOVUK */
/* eslint no-var: */

$(document).ready(function () {
  // Turn off jQuery animation
  jQuery.fx.off = true;

  // Where .multiple-choice uses the data-target attribute
  // to toggle hidden content
  var showHideContent = new GOVUK.ShowHideContent();
  showHideContent.init();

  // Use GOV.UK shim-links-with-button-role.js to trigger a link styled to look like a button,
  // with role="button" when the space key is pressed.
  GOVUK.shimLinksWithButtonRole.init();

  // Details/summary polyfill from frontend toolkit
  GOVUK.details.init();
});
