let codexParser = new CodexParser();
let navigationDrilldown = null;
function initNavigationDrilldown()
{
    // Get model codex navigation drilldown

    let mainSectionsList = document.getElementById("help_screen_widget_content").children;
    let modelCodexNavigationDrilldown = codexParser.getModelCodexNavigation(mainSectionsList);

    // Initialize navigation drilldown
    let drilldownWrapper = document.getElementById("web_codex_nav");
    navigationDrilldown = new NavigationDrilldown(modelCodexNavigationDrilldown);

    drilldownWrapper.appendChild(navigationDrilldown.wrapperNode);
}

function initSearchBox()
{
    let searchBox = new SearchBox(document.getElementById("web_codex_searchbox"));
    searchBox.setSearchCallback(function(searchContent)
    {
        navigationDrilldown.searchDrilldownElementsByLabel(searchContent);
    });
}

initNavigationDrilldown();
initSearchBox();
