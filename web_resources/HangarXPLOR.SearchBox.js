
var HangarXPLOR = HangarXPLOR || {};

// Render a searchbox
HangarXPLOR.SearchBox = function()
{
  HangarXPLOR.Log('Rendering SearchBox');

  const $searchBox = $('<input>', { id: 'searchInput', class: 'js-custom-search', placeholder: 'Search', autocomplete: "off" });
  const $searchBoxMirror = $('<input>', { class: 'js-custom-search-finish', disabled: true, autocomplete: "off" });

  $searchBox.keyup(function() {
      HangarXPLOR.Render();
      HangarXPLOR.RefreshPager();
  });

  $searchBox.keydown(function(event) {
      if(event.keyCode === 9) {
          event.preventDefault();

          if(HangarXPLOR._suggestion.trim().length > 0) {
              $('#searchInput').val(HangarXPLOR._suggestion);
          }
      }
  })

  return [$searchBox[0], $searchBoxMirror[0]];
}
