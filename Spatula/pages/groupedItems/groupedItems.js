(function () {
    "use strict";

    var appView = Windows.UI.ViewManagement.ApplicationView;
    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var nav = WinJS.Navigation;
    var ui = WinJS.UI;
    var utils = WinJS.Utilities;

    ui.Pages.define("/pages/groupedItems/groupedItems.html", {

        // This function updates the ListView with new layouts
        initializeLayout: function (listView, viewState) {
            /// <param name="listView" value="WinJS.UI.ListView.prototype" />
            if (viewState === appViewState.snapped) {
                listView.itemDataSource = Data.groups.dataSource;
                listView.groupDataSource = null;
                listView.layout = new ui.ListLayout();
            } else {
                listView.itemDataSource = Data.items.dataSource;
                listView.groupDataSource = Data.groups.dataSource;
                listView.layout = new ui.GridLayout({ groupHeaderPosition: "top" });
            }
        },

        itemInvoked: function (args) {
            if (appView.value === appViewState.snapped) {
                // If the page is snapped, the user invoked a group.
                var group = Data.groups.getAt(args.detail.itemIndex);
                nav.navigate("/pages/groupDetail/groupDetail.html", { groupKey: group.key });
            } else {
                // If the page is not snapped, the user invoked an item.
                var item = Data.items.getAt(args.detail.itemIndex);
                nav.navigate("/pages/itemDetail/itemDetail.html", { item: Data.getItemReference(item) });
            }
        },

        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            var semanticZoom = element.querySelector("#zoom").winControl;
            var zoomedInListView = element.querySelector("#zoomedInListView").winControl;
            var zoomedOutListView = element.querySelector("#zoomedOutListView").winControl;

            zoomedOutListView.itemTemplate = element.querySelector(".zoomedOutItemTemplate");
            zoomedOutListView.itemDataSource = Data.groups.dataSource;
            zoomedOutListView.groupDataSource = null;
            zoomedOutListView.layout = new ui.GridLayout({ groupHeaderPosition: "top" });

            zoomedInListView.groupHeaderTemplate = element.querySelector(".headerTemplate");
            zoomedInListView.itemTemplate = element.querySelector(".itemtemplate");
            zoomedInListView.oniteminvoked = this.itemInvoked.bind(this);

            if (appView.value === appViewState.snapped) {
                // If the app is snapped, configure the zoomed-in ListView
                // to show groups and lock the SemanticZoom control
                zoomedInListView.itemDataSource = Data.groups.dataSource;
                zoomedInListView.groupDataSource = null;
                zoomedInListView.layout = new ui.ListLayout();
                semanticZoom.locked = true;
            }
            else {
                // If the app isn't snapped, configure the zoomed-in ListView
                // to show items and groups and unlock the SemanticZoom control
                zoomedInListView.itemDataSource = Data.items.dataSource;
                zoomedInListView.groupDataSource = Data.groups.dataSource;
                zoomedInListView.layout = new ui.GridLayout({ groupHeaderPosition: "top" });
                semanticZoom.locked = false;
            }

            semanticZoom.element.focus();
        },

        // This function updates the page layout in response to viewState changes.
        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />
            /// <param name="viewState" value="Windows.UI.ViewManagement.ApplicationViewState" />
            /// <param name="lastViewState" value="Windows.UI.ViewManagement.ApplicationViewState" />

            var semanticZoom = element.querySelector("#zoom").winControl;
            var zoomedInListView = element.querySelector("#zoomedInListView").winControl;

            if (appView.value === appViewState.snapped) {
                zoomedInListView.itemDataSource = Data.groups.dataSource;
                zoomedInListView.groupDataSource = null;
                zoomedInListView.layout = new ui.ListLayout();
                semanticZoom.zoomedOut = false;
                semanticZoom.locked = true;
            }
            else {
                zoomedInListView.itemDataSource = Data.items.dataSource;
                zoomedInListView.groupDataSource = Data.groups.dataSource;
                zoomedInListView.layout = new ui.GridLayout({ groupHeaderPosition: "top" });
                semanticZoom.zoomedOut = true;
                semanticZoom.locked = false;

                // Shouldn't be necessary, but without this statement, the
                // ListView wants to scroll vertically when the app is unsnapped
                // after being snapped while zoomed out
                nav.navigate("/pages/groupedItems/groupedItems.html");
            }
        }
    });
})();
