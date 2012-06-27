(function () {
    "use strict";

    var ui = WinJS.UI;
    var utils = WinJS.Utilities;
    var storage = Windows.Storage;
    var dtm = Windows.ApplicationModel.DataTransfer.DataTransferManager;
    var capture = Windows.Media.Capture;
    var start = Windows.UI.StartScreen;
    var notify = Windows.UI.Notifications;
    var popups = Windows.UI.Popups;
    var _photo;
    var _video;
    var item; // Current recipe

    ui.Pages.define("/pages/itemDetail/itemDetail.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            item = options && options.item ? Data.resolveItemReference(options.item) : Data.items.getAt(0);
            element.querySelector(".titlearea .pagetitle").textContent = item.group.title;
            element.querySelector("article .item-title").textContent = item.title;
            //element.querySelector("article .item-subtitle").textContent = item.preptime;
            //element.querySelector("article .item-image").src = item.backgroundImage;
            //element.querySelector("article .item-image").alt = item.title;

            element.querySelector(".description").innerHTML = item.content;

            // Display ingredients list
            //var ingredients = element.querySelector("article .item-ingredients");
            //for (var i = 0; i < item.ingredients.length; i++) {
            //    var ingredient = document.createElement("h2");
            //    ingredient.textContent = item.ingredients[i];
            //    ingredient.className = "ingredient";
            //    ingredients.appendChild(ingredient);
            //}

            //// Display cooking directions
            //var app = Windows.ApplicationModel.Store.CurrentAppSimulator;
            //var license = app.licenseInformation;

            //if (license.productLicenses.ItalianRecipes.isActive || item.group.key !== "Italian") {
            //    // Display cooking directions
            //    element.querySelector("article .item-directions").textContent = item.directions;
            //}
            //else {
            //    // Show the purchase price on the purchase button
            //    var button = document.querySelector("#purchase");

            //    app.loadListingInformationAsync().then(function (listing) {
            //        var price = listing.productListings.ItalianRecipes.formattedPrice;
            //        button.textContent = "Purchase Italian Recipes for " + price;
            //    });

            //    // Handle licensechanged events
            //    app.licenseInformation.onlicensechanged = function () {
            //        if (license.productLicenses.ItalianRecipes.isActive) {
            //            // Replace purchase button with cooking directions
            //            var directions = element.querySelector("article .item-directions");
            //            if (directions !== null) {
            //                directions.textContent = item.directions;
            //            }
            //        }
            //    };

            //    // Handle clicks of the purchase button
            //    button.onclick = function () {
            //        app.requestProductPurchaseAsync("ItalianRecipes", false);
            //    };
            //}

            element.querySelector(".content").focus();

            // Register for datarequested events for sharing
            dtm.getForCurrentView().addEventListener("datarequested", this.onDataRequested);

            // Handle click events from the Photo command
            //document.getElementById("photo").addEventListener("click", function (e) {
            //    var camera = new capture.CameraCaptureUI();

            //    // Capture a photo and display the share UI
            //    camera.captureFileAsync(capture.CameraCaptureUIMode.photo).then(function (file) {
            //        if (file != null) {
            //            _photo = file;
            //            dtm.showShareUI();
            //        }
            //    });
            //});
            
            // Handle click events from the Video command
            //document.getElementById("video").addEventListener("click", function (e) {
            //    var camera = new capture.CameraCaptureUI();
            //    camera.videoSettings.format = capture.CameraCaptureUIVideoFormat.wmv;

            //    // Capture a video and display the share UI
            //    camera.captureFileAsync(capture.CameraCaptureUIMode.video).then(function (file) {
            //        if (file != null) {
            //            _video = file;
            //            dtm.showShareUI();
            //        }
            //    });
            //});

            // Handle click events from the Pin command
            //document.getElementById("pin").addEventListener("click", function (e) {
            //    var uri = new Windows.Foundation.Uri("ms-appx:///" + item.tileImage);

            //    var tile = new start.SecondaryTile(
            //        item.key,                                    // Tile ID
            //        item.shortTitle,                             // Tile short name
            //        item.title,                                  // Tile display name
            //        JSON.stringify(Data.getItemReference(item)), // Activation argument
            //        start.TileOptions.showNameOnLogo,            // Tile options
            //        uri                                          // Tile logo URI
            //    );

            //    tile.requestCreateAsync();
            //});

            //// Handle click events from the Reminder command
            //document.getElementById("remind").addEventListener("click", function (e) {
            //    // Create a toast notifier
            //    var notifier = notify.ToastNotificationManager.createToastNotifier();

            //    // Make sure notifications are enabled
            //    if (notifier.setting != notify.NotificationSetting.enabled) {
            //        var dialog = new popups.MessageDialog("Notifications are currently disabled");
            //        dialog.showAsync();
            //        return;
            //    }

            //    // Get a toast template and insert a text node containing a message
            //    var template = notify.ToastNotificationManager.getTemplateContent(notify.ToastTemplateType.toastText01);
            //    var element = template.getElementsByTagName("text")[0];
            //    element.appendChild(template.createTextNode("Reminder!"));

            //    // Schedule the toast to appear 30 seconds from now
            //    var date = new Date(new Date().getTime() + 30000);
            //    var stn = notify.ScheduledToastNotification(template, date);
            //    notifier.addToSchedule(stn);
            //});
        },

        onDataRequested: function (e) {
            var request = e.request;
            request.data.properties.title = item.title;

                request.data.properties.description = "Spatula Article";

                var htmlDesc = Windows.ApplicationModel.DataTransfer.HtmlFormatHelper.createHtmlFormat(item.content);
                request.data.setHtmlFormat(htmlDesc);

                // Share image
                var uri = item.backgroundImage;
                if (item.backgroundImage.indexOf("http://") != 0)
                    uri = "ms-appx:///" + uri;

                uri = new Windows.Foundation.Uri(uri);
                var reference = storage.Streams.RandomAccessStreamReference.createFromUri(uri);
                request.data.properties.thumbnail = reference;
                request.data.setBitmap(reference);
        },

        unload: function () {
            WinJS.Navigation.removeEventListener("datarequested", this.onDataRequested);
        }
    });
})();
