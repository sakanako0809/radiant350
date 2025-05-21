general = {
    ContactArea: "集團",
    leftmenu: "",
    footermenu: "",
    apiUri: "https://api.jean.com.tw",
    // apiUri: "https://jeanapi.chainyi.com",
    BindMenuData: function() {
        $("#menu").html("");
        $("#ulfooterMenu").html("");

        let pathName = window.document.location.pathname;
        console.log(pathName);
        let parmAry = pathName.split('/');
        let language = '';
        if (parmAry.length == 3)
            language = parmAry[1];
        else
            language = 'tw';

        General.GetMenu(language);
        console.log(General.footermenu);
        $("#menu").html(General.leftmenu);
        $("#ulfooterMenu").html(General.footermenu);

        $('nav#menu').mmenu({
            extensions: ['effect-slide-menu', 'pageshadow'],
            searchfield: true,
            counters: true,
            navbar: {
                title: 'MENU'
            },
            navbars: [{
                position: 'top',
                content: ['searchfield']
            }, {
                position: 'top',
                content: [
                    'prev',
                    'title',
                    'close'
                ]
            }, {
                position: 'bottom',
                content: [
                    ' WordPress plugin '
                ]
            }]
        });

    },
    GetBanner: function() {
        General.ProcessAjax(true, "/api/Nodes/TWJeanBanner", "GET", "",
            function(result) {
                //console.log(result);
                General.BindBannerData(result);
            },
            function(result) {
                if (result.failText == "") {
                    console.log(result.textStatus);
                    //swal(result.textStatus, "", "warning");
                } else {
                    console.log(result.failText);
                    //swal(result.failText, "", "warning");
                }
            }
        );
    },
    BindBannerData: function(data) {
        $("#divBanner").html("");
        let bannerContent = "";
        if (data.attachmentId != null && data.attachmentId != "") {
            bannerContent += '<video class="video_bg" preload="auto" autoplay="true" loop="loop" muted="muted">' +
                '<source src="/api/File/AttachmentFile?attachmentID=' + data.attachmentId + '" type="video/mp4">' +
                '</video>' +
                '<img src="../img/index/logo.png" alt="">';
        }

        $("#divBanner").html(bannerContent);
    },
    AddZero: function(val) {
        if (val < 10) {
            val = "0" + val;
        }
        return val;
    },
    QueryString: function(name) {
        //宣告正規表達式
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        /*
         * window.location.search 獲取URL ?之後的參數(包含問號)
         * substr(1) 獲取第一個字以後的字串(就是去除掉?號)
         * match(reg) 用正規表達式檢查是否符合要查詢的參數
         */
        var r = window.location.search.substr(1).match(reg);
        //如果取出的參數存在則取出參數的值否則回穿null
        if (r !== null) return unescape(r[2]);
        return null;
    },
    ProcessAjax: function(async, url, method, data, processDone, processFailed) {
        //console.log(url);
        var settings = {
            "async": async,
            "crossDomain": true,
            "url": general.apiUri + url,
            "method": method,
            "headers": {
                "Content-Type": "application/json",
                "cache-control": "no-cache"
            },
            "processData": false,
            "data": data //"{\"keyword\":\"admin\",\"status\":\"\"}"
        };

        $.ajax(settings)
            .done(function(response) {
                processDone(response);
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                let failResult = {
                    textStatus: jqXHR.statusText,
                    failText: jqXHR.responseText,
                    Code: jqXHR.status
                };
                processFailed(failResult);
            });
    },
    GetMenu: function(language) {
        //let url = '/api/Nodes/TwJeanMeun';
        let url = '/api/Nodes/JeanMeun?language=' + language;
        console.log(url);
        General.ProcessAjax(false, url, "GET", "",
            function(result) {
                console.log(result);
                //General.BindMenuData(result);

                let menuContent = '<ul>';
                let footermenuContent = '';

                $.each(result, function(index, element) {
                    if (element.childCount == 0) {
                        if (element.url == "") {
                            menuContent += '<li> <a href="nodepage?id=' + element.nodeId + '" target="' + element.urlTarget + '"> ' + element.title + '</a> </li>'
                        } else {
                            if (element.urlTarget == "_blank") {
                                menuContent += '<li> <a href="' + element.url + '" target="' + element.urlTarget + '"> ' + element.title + '</a> </li>';
                            } else {
                                element.urlTarget = '_blank';
                                if (element.url.indexOf('?') >= 0) {
                                    menuContent += '<li> <a href="' + element.url + '&id=' + element.nodeId + '" target="' + element.urlTarget + '"> ' + element.title + '</a> </li>';
                                } else {
                                    menuContent += '<li> <a href="' + element.url + '?id=' + element.nodeId + '" target="' + element.urlTarget + '"> ' + element.title + '</a> </li>';
                                }
                            }
                        }

                    } else {
                        menuContent += '<li>';
                        menuContent += '<a href="#">' + element.title + '</a>';
                        menuContent += '<ul>';
                        menuContent += General.GetChildrenMenu(element.lstChildren);
                        menuContent += '</ul>';
                        menuContent += '</li>';
                    }

                    let x = index % 3;
                    if (index == 0 || x == 0) {
                        if (index == 0) {
                            footermenuContent += '<li>';
                        } else {
                            footermenuContent += '</li><li>';
                        }
                    }
                    footermenuContent += '<p><a href="' + element.url + '">' + element.title + '</a></p>';
                });
                menuContent += '</ul>';
                if (footermenuContent != '')
                    footermenuContent += '</li>';

                General.leftmenu = menuContent;
                General.footermenu = footermenuContent

            },
            function(result) {
                if (result.failText == "") {
                    console.log(result.textStatus);
                    //swal(result.textStatus, "", "warning");
                } else {
                    console.log(result.failText);
                    //swal(result.failText, "", "warning");
                }
            }
        );

    },
    GetChildrenMenu: function(datas) {
        let childmenu = '';
        $.each(datas, function(index, element) {
            if (element.childCount == 0) {
                if (element.url == "") {
                    childmenu += '<li> <a href="nodepage?id=' + element.nodeId + '" target="' + element.urlTarget + '"> ' + element.title + '</a> </li>';
                } else {
                    if (element.urlTarget == "_blank") {
                        childmenu += '<li> <a href="' + element.url + '" target="' + element.urlTarget + '"> ' + element.title + '</a> </li>';
                    } else {
                        element.urlTarget = '_blank';
                        if (element.url.indexOf('?') >= 0) {
                            childmenu += '<li> <a href="' + element.url + '&id=' + element.nodeId + '" target="' + element.urlTarget + '"> ' + element.title + '</a> </li>';
                        } else {
                            childmenu += '<li> <a href="' + element.url + '?id=' + element.nodeId + '" target="' + element.urlTarget + '"> ' + element.title + '</a> </li>';
                        }
                    }
                }

            } else {
                childmenu += '<li>';
                childmenu += '<a href="#">' + element.title + '</a>';
                childmenu += '<ul>';
                childmenu += General.GetChildrenMenu(element.lstChildren);
                childmenu += '</ul>';
                childmenu += '</li>';
            }
        });
        return childmenu;
    },
    LineBlock: function(str) {
        let find = '\n';
        let re = new RegExp(find, 'g');
        str = str.replace(re, '<br>');
        return str;
    },
    InitI18next: function(sLanguage, sNamespaces, callback) {
        i18next
            .use(i18nextXHRBackend)
            .init({
                    debug: true,
                    lng: sLanguage,
                    ns: [sNamespaces, "translation"],
                    defaultNS: [sNamespaces, "translation"],
                    backend: {
                        // for all available options read the backend's repository readme file
                        loadPath: '/locales/{{lng}}/{{ns}}.json'
                    }
                },
                function(t) {
                    jqueryI18next.init(i18next, $, {
                        tName: 't', // --> appends $.t = i18next.t
                        i18nName: 'i18n', // --> appends $.i18n = i18next
                        handleName: 'localize', // --> appends $(selector).localize(opts);
                        selectorAttr: 'data-i18n', // selector for translating elements
                        targetAttr: 'i18n-target', // data-() attribute to grab target element to translate (if different than itself)
                        optionsAttr: 'i18n-options', // data-() attribute that contains options, will load/set if useOptionsAttr = true
                        useOptionsAttr: false, // see optionsAttr
                        parseDefaultValueFromContent: true // parses default values from content ele.val or ele.text
                    });

                    $("body").localize();

                    if (callback !== null) {
                        callback();
                    }

                });

    },
    GetLanguage: function() {
        let pathName = window.document.location.pathname;
        let parmAry = pathName.split('/');
        let language = parmAry[1];

        return language;
    },
    OpenUrl: function(url) {
        window.location.href = url;
        //window.open(url,"_self");
    }
};