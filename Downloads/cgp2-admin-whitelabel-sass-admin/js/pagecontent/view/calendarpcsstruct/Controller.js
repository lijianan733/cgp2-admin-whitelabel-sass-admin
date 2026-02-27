Ext.define('CGP.pagecontent.view.calendarpcsstruct.Controller', {
    //生成pageContent
    createPageContent: function (formData,win) {
        var me = this;
        var parser = new DOMParser();
        var mask = win.setLoading();
        var xmlDoc = parser.parseFromString(formData.content, "text/xml");
        var userParams = formData;
        var containerEles = xmlDoc.getElementsByTagName('rect');
        var layers = [
            {
                "clazz": "Layer",
                "readOnly": false,
                "_id": JSGetCommonKey(false),
                "items": []
            }
        ];
        var transform = userParams.transform || [];
        Ext.Array.each(transform,function (item,index){
            transform[index] = parseFloat(item);
        });
        var pcInfo = {};
        Ext.Array.each(containerEles, function (containerEle,index) {
            if(index == 0){
                pcInfo = {
                    width: Math.ceil(containerEle.getAttribute('width')),
                    height: Math.ceil(containerEle.getAttribute('height'))
                }
            }else{
                var elePosition = {
                    x: Math.round(containerEle.getAttribute('x')),
                    y: Math.round(containerEle.getAttribute('y')),
                    width: Math.ceil(containerEle.getAttribute('width')),
                    height: Math.ceil(containerEle.getAttribute('height'))
                }
                var customContainer = {
                    "x": elePosition.x,
                    "y": elePosition.y,
                    "width": elePosition.width,
                    "height": elePosition.height,
                    "scale": 1,
                    "clazz": "Container",
                    "_id": JSGetCommonKey(false),
                    "items": [{
                        "clazz" : "Container",
                        "_id" : JSGetCommonKey(false),
                        "readOnly" : false,
                        "tags" : [],
                        "x" : 0,
                        "y" : 0,
                        "width" : 0,
                        "height" : 0,
                        "scale" : 1,
                        "transform" : transform,
                        "items" : []
                    }
                    ]
                };
                layers[0].items.push(customContainer);
            }

        });
        mask.hide();
        layers[0].items = me.containerElesSort(layers[0].items,userParams.arrangeRule);
        var pageContent = {
            "clazz" : "com.qpp.cgp.domain.bom.runtime.PageContent",
            "code" : userParams.name,
            generateMode: 'manual',
            "name" : userParams.name,
            "description" : userParams.description,
            "width" : pcInfo.width,
            "height" : pcInfo.height,
            layers: layers
        };
        return pageContent;
    },
    containerElesSort: function (containerEles, arrangeRule){
        var yList = [];
        var xList = [];
        var containerElYList = [];
        if(arrangeRule == 'LeftToRight'){
            Ext.Array.each(containerEles,function (containerEle){
                containerElYList.push(containerEle.y);
            })
            yList = Ext.Array.merge(yList,containerElYList);
            var yContainerList = [];
            //找出同行的container，组成数组
            Ext.Array.each(yList,function (y){
                var rowList = [];
                Ext.Array.each(containerEles,function (containerEle){
                    if(containerEle.y == y){
                        rowList.push(containerEle)
                    }
                });
                rowList = rowList.sort(function (a,b){return a.x-b.x})
                yContainerList = Ext.Array.merge(yContainerList,rowList);
            });
            return yContainerList
        }else if(arrangeRule == 'RightToLeft'){
            Ext.Array.each(containerEles,function (containerEle){
                containerElYList.push(containerEle.y);
            })
            yList = Ext.Array.merge(yList,containerElYList);
            var yContainerList = [];
            //找出同行的container，组成数组
            Ext.Array.each(yList,function (y){
                var rowList = [];
                Ext.Array.each(containerEles,function (containerEle){
                    if(containerEle.y == y){
                        rowList.push(containerEle)
                    }
                });
                rowList = rowList.sort(function (a,b){return a.x-b.x})
                rowList.reverse();
                yContainerList = Ext.Array.merge(yContainerList,rowList);
            });
            return yContainerList;
        }else if(arrangeRule == 'TopToBottom'){
            Ext.Array.each(containerEles,function (containerEle){
                containerElYList.push(containerEle.x);
            })
            xList = Ext.Array.merge(xList,containerElYList);
            var xContainerList = [];
            //找出同行的container，组成数组
            Ext.Array.each(xList,function (y){
                var colList = [];
                Ext.Array.each(containerEles,function (containerEle){
                    if(containerEle.x == x){
                        colList.push(containerEle)
                    }
                });
                colList = colList.sort(function (a,b){return a.y-b.y})
                xContainerList = Ext.Array.merge(xContainerList,colList);
            });
            return xContainerList;
        }else if(arrangeRule == 'BottomToTop'){
            Ext.Array.each(containerEles,function (containerEle){
                containerElYList.push(containerEle.x);
            })
            xList = Ext.Array.merge(xList,containerElYList);
            var xContainerList = [];
            //找出同行的container，组成数组
            Ext.Array.each(xList,function (y){
                var colList = [];
                Ext.Array.each(containerEles,function (containerEle){
                    if(containerEle.x == x){
                        colList.push(containerEle)
                    }
                });
                colList = colList.sort(function (a,b){return b.y-a.y})
                xContainerList = Ext.Array.merge(xContainerList,colList);
            });
            return xContainerList;
        }
    },
    //保存pageContent
    savePageContent: function (pageContentSchema,win){
        var mask = win.setLoading();
        Ext.Ajax.request({
            url: adminPath + 'api/pageContents',
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            jsonData: pageContentSchema,
            success: function (response, options) {
                var resp = Ext.JSON.decode(response.responseText);
                if (resp.success) {
                    mask.hide();
                    Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('saveSuccess'), function () {
                        var id = resp.data._id;
                        var htmlUrl = path + "partials/pagecontent/edit.html?id=" + id;
                        win.close();
                        JSOpen({
                            id: "pagecontent_edit",
                            url: htmlUrl,
                            title: i18n.getKey('edit') + "_" + i18n.getKey('pageContent'),
                            refresh: true
                        });
                    });
                } else {
                    mask.hide();
                    Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('saveFailure') + resp.data.message)
                }
            },
            failure: function (response, options) {
                var object = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('saveFailure') + object.data.message);
            },
            callback: function () {
                mask.hide();
            }
        });
    }
})
