Ext.define('CGP.pagecontentschema.view.batchgeneratepcsstruct.Controller', {
    //生成pageContentSchema
    createPageContentSchema: function (formData,win) {
        var me = this;
        var parser = new DOMParser();
        var mask = win.setLoading();
        var xmlDoc = parser.parseFromString(formData.content, "text/xml");
        var userParams = formData.userParams;
        var containerEles = xmlDoc.getElementsByClassName('blood')[0].children;
        var layers = [
            {
                "clazz": "Layer",
                "readOnly": false,
                "_id": JSGetCommonKey(false),
                "items": []
            }, {
                "clazz": "Layer",
                "readOnly": false,
                "_id": JSGetCommonKey(false),
                "items": []
            }
        ]
        Ext.Array.each(containerEles, function (containerEle) {
            var elePosition = {
                x: Math.round(containerEle.getAttribute('x')),
                y: Math.round(containerEle.getAttribute('y'))
            }
            var customContainer = {
                "x": elePosition.x,
                "y": elePosition.y,
                "width": userParams.customizingLayer.containerSize.width,
                "height": userParams.customizingLayer.containerSize.height,
                "rotation": -90,
                "clipPath": {
                    "d": userParams.customizingLayer.clipPath,
                    "clazz": "Path",
                    "_id": JSGetCommonKey(false)
                },
                "clazz": "Container",
                "_id": JSGetCommonKey(false),
                "items": [{
                    "x": 0,
                    "y": 0,
                    "width": userParams.customizingLayer.pictureSize.width,
                    "height": userParams.customizingLayer.pictureSize.height,
                    "clazz": "Picture",
                    "_id": JSGetCommonKey(false)
                }]
            };
            layers[0].items.push(customContainer);
            var displayContainer = {
                "x": elePosition.x,
                "y": elePosition.y,
                "width": userParams.displayLayer.containerSize.width,
                "height": userParams.displayLayer.containerSize.height,
                "rotation": -90,
                "clazz": "Container",
                "_id": JSGetCommonKey(false),
                "items": [{
                    "x": 0,
                    "y": 0,
                    "width": userParams.displayLayer.imageSize.width,
                    "imageName": userParams.displayLayer.imageName,
                    "height": userParams.displayLayer.imageSize.height,
                    "imageWidth": userParams.displayLayer.imageSize.width,
                    "imageHeight": userParams.displayLayer.imageSize.height,
                    "clazz": "Image",
                    "_id": JSGetCommonKey(false)
                }]
            };
            layers[1].items.push(displayContainer);
        });
        mask.hide();
        layers[0].items = me.containerElesSort(layers[0].items,userParams.arrangeRule);
        layers[1].items = me.containerElesSort(layers[1].items,userParams.arrangeRule);
        var pageContentSchema = {
            "clazz" : "com.qpp.cgp.domain.bom.PageContentSchema",
            "code" : formData.userParams.name,
            "name" : formData.userParams.name,
            "description" : formData.userParams.description,
            "width" : formData.userParams.width,
            "height" : formData.userParams.height,
            layers: layers
        };
        return pageContentSchema;
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
    //保存pageContentSchema
    savePageContentSchema: function (pageContentSchema,win){
        var mask = win.setLoading();
        Ext.Ajax.request({
            url: adminPath + 'api/pageContentSchemas',
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
                        var htmlUrl = path + "partials/pagecontentschema/edit.html?id=" + id;
                        win.close();
                        JSOpen({
                            id: "pagecontentschema_edit",
                            url: htmlUrl,
                            title: i18n.getKey('edit') + "_" + i18n.getKey('pageContentSchema'),
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
