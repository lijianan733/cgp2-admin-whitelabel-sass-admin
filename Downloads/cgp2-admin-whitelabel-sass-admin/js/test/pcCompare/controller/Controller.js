Ext.define('CGP.test.pcCompare.controller.Controller', {
    getPcCatalogs: function (productInstence, CompareType, mainPage) {
        var me = this;
        var allMaterialView = [];
        var productMaterialViews = productInstence.productMaterialViews;
        var simplifyMaterialViews = [];
        if (!Ext.Object.isEmpty(productInstence.simplifyBomNodeObject)) {
            me.getSMVs(productInstence.simplifyBomNodeObject, simplifyMaterialViews);
        }
        //JSGetUUID()
        var pictures = me.getMvCachePictrues(productInstence.builderCache);
        if (!Ext.isEmpty(simplifyMaterialViews) && CompareType == 'cacheImageCompare') {
            var smvPC = me.getPageContents(simplifyMaterialViews, pictures);
            allMaterialView.push({
                id: JSGetUUID(),
                text: 'SMV',
                leaf: false,
                //expanded: true,
                children: smvPC
            })
        }
        if (!Ext.isEmpty(productMaterialViews)) {
            var pmvPC = me.getPageContents(productMaterialViews, pictures);
            allMaterialView.push({
                id: JSGetUUID(),
                text: 'PMV',
                leaf: false,
                //expanded: true,
                children: pmvPC
            })
        }
        /*if(!Ext.isEmpty(simplifyMaterialViews) && CompareType == 'cacheImageCompare'){
            var smvPC = me.getPageContents(simplifyMaterialViews,pictures);
            allMaterialView[1] = {
                id: JSGetUUID(),
                text: 'SMV',
                leaf: false,
                expanded: true,
                children: smvPC
            }
        }*/
        if (Ext.isEmpty(allMaterialView)) {
            Ext.Msg.alert('提示', 'PC列表为空！', function () {
                var pcCompareTab = window.parent.Ext.getCmp('pcCompareBuilder');
                pcCompareTab.close();
            });

        } else {
            return allMaterialView;
        }

    },
    getPcSchemaItems: function () {

    },
    getMvCachePictrues: function (builderCache) {
        var cachePictrues = [];
        if (!Ext.Object.isEmpty(builderCache)) {
            Ext.Array.each(builderCache.builderUserDesign, function (builderDesign) {
                try {
                    cachePictrues.push(builderDesign.objectJSON.pagecontents[0])
                } catch (e) {
                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('加载用户定制图片失败！'));
                }

            });
        }
        return cachePictrues;
    },
    getComposingPages: function () {
        var me = this;

        return me.jobPages;
    },
    getComposingJobs: function (orderId, orderItemId, previewPanel, jobTypeCombo, preview, impressionVersion) {
        var me = this;
        var jobs = [];
        var jobPages = {};
        var tabs = window.parent.Ext.getCmp('tabs');
        var tab = tabs.getComponent('pcCompareBuilder');
        //var pcCompareViewport = Ext.getCmp('pcCompareViewport');
        var mask = previewPanel.setLoading('正在加载，请等待！');
        var url = jobServerPath+ 'api/preview/orders/' + orderId + '/orderItems/' + orderItemId;
        if (impressionVersion == 'v2' || impressionVersion == 'v2_1') {
            url = jobServerPath + 'api/preview/orders/' + orderId + '/orderItems/' + orderItemId;
        }
        var requestConfig = {
            url: url,
            method: 'POST',
            //async: false,
            timeout: 60000,
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                if (!response.success) {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                    mask.hide();
                    return;
                } else {
                    mask.hide();

                    Ext.Array.each(response.data, function (item) {
                        jobs.push({name: item.job.type, value: item.job.type});
                        jobPages[item.job.type] = [];
                        Ext.Array.each(item.pages, function (page) {
                            jobPages[item.job.type].push(page);
                        })
                    });
                    me.jobPages = jobPages;
                    jobTypeCombo.getStore().add(jobs);
                    jobTypeCombo.setValue(jobs[0].value);
                    preview.jobPages = jobPages;
                    preview.refreshData(jobs);
                }
            },
            failure: function (resp) {
                mask.hide();
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            },
            callback: function () {
                mask.hide();
            }
        };
        Ext.Ajax.request(requestConfig);

        //return jobs;
    },
    getProductInstance: function (productInstanceId) {
        var me = this;
        var productInstence = {};
        var requestConfig = {
            url: adminPath + 'api/bom/productInstances/' + productInstanceId + '/V2?includeReferenceEntity=true&includeMaterialReferenceEntity=false',
            method: 'GET',
            async: false,
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                if (!response.success) {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                    return;
                } else {
                    productInstence = response.data;
                }
            },
            failure: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        }
        Ext.Ajax.request(requestConfig);
        me.productInstence = productInstence;
        return productInstence;
    },
    getPageContents: function (materialViews, pictures) {
        var pageContents = [];
        if (!Ext.isEmpty(materialViews)) {
            Ext.Array.each(materialViews, function (materialView) {
                Ext.Array.each(materialView.pageContents, function (pageContent) {
                    var haveCachePicture = false;
                    var comparePicture = {};
                    Ext.Array.each(pictures, function (picture) {
                        if (picture.id == pageContent._id) {
                            haveCachePicture = true;
                            comparePicture = picture;
                        }
                    });
                    pageContents.push({
                        id: JSGetUUID(),
                        text: 'PC<' + pageContent._id + '>',
                        pageContent: pageContent,
                        leaf: true,
                        materialViewName: materialView.name,
                        haveCachePicture: haveCachePicture,
                        comparePicture: comparePicture
                    });
                })
            })
        }
        return pageContents;
    },
    getSMVs: function (simplifyBomNodeObject, allSmvs) {
        var me = this;
        if (!Ext.isEmpty(simplifyBomNodeObject.simplifyMaterialViews)) {
            Ext.each(simplifyBomNodeObject.simplifyMaterialViews, function (simplifyMaterialView) {
                allSmvs.push(simplifyMaterialView);
            });
        }
        if (!Ext.isEmpty(simplifyBomNodeObject.child)) {
            Ext.Array.each(simplifyBomNodeObject.child, function (child) {
                me.getSMVs(child, allSmvs);
            })
        }
    },
    buildPCDataTree: function (pageContent) {
        var pcDataTree = [];
        Ext.Array.each(pageContent.layers, function (layer) {
            layer.id = JSGetUUID();
            var layerNode = {
                id: layer.id,
                text: 'layer（' + layer.code + '）',
                leaf: true,
                children: []
            };
            if (!Ext.isEmpty(layer.items)) {
                layerNode.leaf = false;
                Ext.Array.each(layer.items, function (item, index) {
                    item.id = JSGetUUID();
                    var itemNode = {
                        id: item.id,
                        text: 'item' + (index + 1) + '（' + item.clazz + '）',
                        leaf: true
                    };
                    layerNode.children.push(itemNode);
                })
            }
            pcDataTree.push(layerNode);
        });
        var pcDataTreeRootNode = {
            id: JSGetUUID(),
            text: '',
            children: pcDataTree
        };
        return pcDataTreeRootNode;
    },
    updateBuilderPcData: function (pageContent, picture, compareType) {
        top.buidlerCompareData = {
            "boardScale": 2,
            "opacity": 0.5
        };
        top.buidlerCompareData.pageContent = pageContent;
        if (!Ext.Object.isEmpty(picture)) {
            if (compareType == 'cacheImageCompare') {
                top.buidlerCompareData.file = picture;
            } else {
                top.buidlerCompareData.file = picture;
                top.buidlerCompareData.file.fileName = picture.file.split('/').pop();
            }
        }


    }
});
