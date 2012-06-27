(function () {
    "use strict";

    var dataPromises = [];
    var categories;

    var categoryPosts = new WinJS.Binding.List();

    // Get a reference for an item, using the group key and item title as a
    // unique reference to the item that can be easily serialized.
    function getItemReference(item) {
        return [item.group.key, item.title];
    }

    function resolveGroupReference(key) {
        for (var i = 0; i < groupedItems.groups.length; i++) {
            if (groupedItems.groups.getAt(i).key === key) {
                return groupedItems.groups.getAt(i);
            }
        }
    }

    function resolveItemReference(reference) {
        for (var i = 0; i < groupedItems.length; i++) {
            var item = groupedItems.getAt(i);
            if (item.group.key === reference[0] && item.title === reference[1]) {
                return item;
            }
        }
    }

    // This function returns a WinJS.Binding.List containing only the items
    // that belong to the provided group.
    function getItemsFromGroup(group) {
        return list.createFiltered(function (item) { return item.group.key === group.key; });
    }


    var list = getCategoryPosts();
    var groupedItems = list.createGrouped(
        function groupKeySelector(item) { return item.group.key; },
        function groupDataSelector(item) { return item.group; }
    );


    /**** BELOW this is what must be replaced *****/
    //WinJS.xhr({ url: "http://www.yuppiechef.co.za/spatula/feed/" }).then(function (xhr) {
    //    var items = JSON.parse(xhr.responseText);

    //    // Add the items to the WinJS.Binding.List
    //    items.forEach(function (item) {
    //        list.push(item);
    //    });
    //});
    /**** ABOVE this is what must be replaced *****/

    function getFeeds() {
        // Create an object for each feed in the blogs array
        categories = [
        {
            key: "kitchen-gear",
            groupImage: "/images/categories/kitchen-gear.jpg",
            backgroundImage: "/images/categories/kitchen-gear.jpg",
            description: "This is a discription of the Kitchen Gear group.",
            url: "http://www.yuppiechef.co.za/spatula/category/kitchen-gear/feed/",
            title: "tbd", updated: "tbd",
            acquireSyndication: acquireSyndication, dataPromise: null
        },
        {
            key: "yuppyiechef-diary",
            groupImage: "/images/categories/diary.jpg",
            backgroundImage: "/images/categories/diary.jpg",
            description: "This is a discription of the Diary group.",
            url: "http://www.yuppiechef.co.za/spatula/category/yuppiechef-diary/feed/",
            title: "tbd", updated: "tbd",
            acquireSyndication: acquireSyndication, dataPromise: null
        },
        {
            key: "food-and-drink",
            groupImage: "/images/categories/food-and-drink.jpg",
            backgroundImage: "/images/categories/food-and-drink.jpg",
            description: "This is a discription of the Food and Drink group.",
            url: "http://www.yuppiechef.co.za/spatula/category/food-and-drink/feed/",
            title: "tbd", updated: "tbd",
            acquireSyndication: acquireSyndication, dataPromise: null
        },
        {
            key: "people-and-places",
            groupImage: "/images/categories/people-and-places.jpg",
            backgroundImage: "/images/categories/people-and-places.jpg",
            description: "This is a discription of the People and Places group.",
            url: "http://www.yuppiechef.co.za/spatula/category/people-and-places/feed/",
            title: "tbd", updated: "tbd",
            acquireSyndication: acquireSyndication, dataPromise: null
        },
        {
            key: "news-and-trends",
            groupImage: "/images/categories/news-and-trends.jpg",
            backgroundImage: "/images/categories/news-and-trends.jpg",
            description: "This is a discription of the News and Trends group.",
            url: "http://www.yuppiechef.co.za/spatula/category/news-and-trends/feed/",
            title: "tbd", updated: "tbd",
            acquireSyndication: acquireSyndication, dataPromise: null
        }];

        categories.forEach(function (feed) {
            feed.dataPromise = feed.acquireSyndication(feed.url);
            dataPromises.push(feed.dataPromise);
        });
        
        return WinJS.Promise.join(dataPromises).then(function () {
            ExtendedSplash.remove();
            return categories;
        });
    }

    function acquireSyndication(url) {
        var uri = new Windows.Foundation.Uri(url);
        var client = new Windows.Web.Syndication.SyndicationClient();
        client.bypassCacheOnRetrieve = false;
        return client.retrieveFeedAsync(uri)
        //return WinJS.xhr({ url: url });
    }

    function getCategoryPosts() {
        getFeeds().then(function () {
            categories.forEach(function (category) {
                category.dataPromise.then(function (articleSyndication) {
                    //var articleSyndication = articleResponse.responseXML;

                    var title = articleSyndication.title.text;//.querySelector("channel > title").textContent;
                    category.title = title.replace("Spatula Magazine » ", "");

                    var published = articleSyndication.lastUpdatedTime;//.querySelector("channel > lastBuildDate").textContent;

                    var date = new Date(published);
                    var dateFmt = new Windows.Globalization.DateTimeFormatting.DateTimeFormatter(
                        "month.abbreviated day year.full");
                    var categoryDate = dateFmt.format(date);
                    category.updated = "Last updated " + categoryDate;
                    category.articleCount = articleSyndication.items.length;

                    getItemsFromSyndication(articleSyndication, categoryPosts, category);
                }, function (e) {
                    console.log(e);
                });
            });
        });
        return categoryPosts;
    }

    function getItemsFromSyndication(articleSyndication, categoryPosts, category) {
        var posts = articleSyndication.items;//.querySelectorAll("item");

        for (var postIndex = 0; postIndex < posts.length; postIndex++) {
            var post = posts[postIndex];

            // Get the title, author, and date published
            var postTitle = post.title.text;//.querySelector("title").textContent;
            var postAuthor = post.authors[0].nodeValue;//.querySelector("creator").textContent;
            var postPublished = post.publishedDate;//.querySelector("pubDate").textContent;

            // Convert the date for display
            var postDate = new Date(postPublished);
            var monthFmt = new Windows.Globalization.DateTimeFormatting.DateTimeFormatter(
                "month.abbreviated");
            var dayFmt = new Windows.Globalization.DateTimeFormatting.DateTimeFormatter(
                "day");
            var yearFmt = new Windows.Globalization.DateTimeFormatting.DateTimeFormatter(
                "year.full");
            var categoryPostMonth = monthFmt.format(postDate);
            var categoryPostDay = dayFmt.format(postDate);
            var categoryPostYear = yearFmt.format(postDate);

            var firstImgRegEx = new RegExp('<img class="?(?:alignnone|aligncenter).*src="(.*)" alt');
            var tweetRegEx = /<div class="?tweetmeme_button"? style="float:right;margin-right:10px;">[\s\S]*<\/div>\n?/m;

            var img = firstImgRegEx.exec(post.summary.text)[1];
            var staticContent = toStaticHTML(post.summary.text); //post.querySelector("encoded").textContent);
            var noTweetStaticContent = staticContent.replace(tweetRegEx, "");


            categoryPosts.push({
                group: category,
                key: category.key,
                title: postTitle,
                author: postAuthor,
                month: categoryPostMonth.toUpperCase(),
                day: categoryPostDay,
                year: categoryPostYear,
                backgroundImage: img,
                content: noTweetStaticContent
            });
        }
    }

    WinJS.Namespace.define("Data", {
        items: groupedItems,
        groups: groupedItems.groups,
        getItemsFromGroup: getItemsFromGroup,
        getItemReference: getItemReference,
        resolveGroupReference: resolveGroupReference,
        resolveItemReference: resolveItemReference
    });
})();
