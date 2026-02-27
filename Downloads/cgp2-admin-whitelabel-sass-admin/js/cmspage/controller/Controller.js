Ext.define('CGP.cmspage.controller.Controller', {


    /**
     * 預覽頁面控制方法
     * @param record
     */
    previewPage: function (record) {
        var websiteId = record.get('websiteId');
        var outputUrl = record.get('outputUrl');
        if (record.get('type') === 'normal') {
            Ext.Ajax.request({
                url: adminPath + 'api/admin/cmsPage/' + websiteId + '/preview?url=' + outputUrl,
                method: 'GET',
                headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                success: function (response) {
                    var responseMessage = Ext.JSON.decode(response.responseText);
                    if (responseMessage.success) {
                        window.open(responseMessage.data);
                    } else {
                        Ext.Msg.alert(i18n.getKey('prompt'), responseMessage.data.message);
                    }
                },
                failure: function (response) {
                    var responseMessage = Ext.JSON.decode(response.responseText);
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
            });
            //window.open('http://192.168.26.28:8888/cgp-cms/websites/' + websiteId + '/pages?url=' + outputUrl);

        } else {
            Ext.create("Ext.window.Window", {
                modal: true,
                autoShow: true,
                layout: 'fit',
                constrain: true,
                id: 'selectPreviewPage',
                items: [Ext.create("CGP.cmspage.view.PreviewPage", {
                    websiteId: websiteId,
                    outputUrl: outputUrl
                })]
            });
        }
    },
    /**
     * 生成normal類型的頁面
     * @param {Number} websiteId 網站ID
     * @param {Object} record 选中的当行记录
     * @param {Number} pageId 頁面ID
     */
    createNormalPage: function (record, websiteId, pageId) {
        var myMask = new Ext.LoadMask(Ext.getBody(), {msg: "请稍等,正在生成页面..."});
        myMask.show();
        var requestConfig = {
            url: adminPath + 'api/cmsPages/generateHtmls',
            jsonData: {
                "websiteId": websiteId, "pageList": [
                    {"pageId": pageId}
                ]
            },
            method: 'POST',
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (response) {

                if (myMask != undefined) {
                    myMask.hide();
                }
                var responseMessage = Ext.JSON.decode(response.responseText);
                var name = record.get('name');
                var isSuccess;
                if (responseMessage.success == true) {
                    isSuccess = '成功';
                } else {
                    isSuccess = '失败';
                }
                if (responseMessage.success == true) {
                    if (responseMessage.data[0]) {
                        if (responseMessage.data[0].success == true) {
                            Ext.Msg.alert('提示', name + ':生成页面' + isSuccess);
                        } else {
                            if (Ext.isEmpty(responseMessage.data[0].errMsg)) {
                                Ext.Msg.alert('提示', name + ':生成页面失败！');
                            } else {
                                Ext.Msg.alert('提示', name + ':生成页面失败！ 失败信息：' + responseMessage.data[0].errMsg);
                            }
                        }
                    } else {
                        Ext.Msg.alert('提示', name + ':生成页面' + isSuccess);
                    }
                } else {
                    Ext.Msg.alert('提示', name + ':生成页面' + isSuccess + ' 生成信息：' + responseMessage.data.message);
                }
            },
            failure: function (response) {
                if (myMask != undefined) {
                    myMask.hide();
                }
                var responseMessage = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
            }

        }
        Ext.Ajax.request(requestConfig);

    },
    /**
     * 顯示產品頁面生成窗口
     * @param {Number} websiteId 網站ID
     * @param {Number} pageId 頁面ID
     * @param {String} pageName 頁面名稱
     */
    showCreateProductPageWindow: function (websiteId, pageId, pageName, cmspageStore) {
        var me = this;
        Ext.create('CGP.cmspage.view.SelectProductWin', {
            controller: me,
            websiteId: websiteId,
            pageId: pageId,
            pageName: pageName,
            cmspageStore: cmspageStore
        });

    },

    /**
     * 生成頁面控制方法
     * @param {Object} record 选中的当行记录
     */
    createPage: function (record, cmspageStore) {
        var me = this;
        var websiteId = record.get('websiteId');
        var pageId = record.get('id');
        var pageName = record.get('name');
        if (record.get('type') === 'normal') {
            me.createNormalPage(record, websiteId, pageId);
        } else {
            me.showCreateProductPageWindow(websiteId, pageId, pageName, cmspageStore);
        }
    },
    /**
     * 生成product類型頁面
     * @param {Number} websiteId 網站ID
     * @param {CGP.cmspage.view.SelectProductWin} selectProductWin 為product類型頁面選擇產品的window
     * @param {Number} pageId 頁面ID
     * @param {String} pageName 页面名称
     * @param {CGP.cmspage.view.ProductList} productList 過濾后的產品列表
     */
    confirmCreateProductPage: function (websiteId, selectProductWin, pageId, productList, pageName, cmspageStore) {
        var me = this;
        var all = [];
        var pageListObj = productList.getValue();
        var selectProductData = productList.getlist();
        var pageList = pageListObj[productList.pageId];
        var jsonData = {'websiteId': websiteId, 'pageList': pageList};
        var myMask = new Ext.LoadMask(selectProductWin, {msg: "请稍等,正在生成页面...<br>(需生成页面较多时，等待时间较长！)"});
        myMask.show();
        var requestConfig = {
            url: adminPath + 'api/cmsPages/generateHtmls',
            jsonData: jsonData,
            method: 'POST',
            timeout: 1000000,
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (response) {
                if (myMask != undefined) {
                    myMask.hide();
                }
                var responseMessage = Ext.JSON.decode(response.responseText);
                var messageList = [];
                var pageDataList = null;
                if (!Ext.isEmpty(responseMessage.data)) {
                    me.createResponseDataWin(responseMessage.data, selectProductData, pageName, pageList, cmspageStore)
                } else {
                    Ext.Msg.alert('提示', '生成页面失败！失败信息：' + responseMessage.data.message);
                }
            },
            failure: function (response) {
                if (myMask != undefined) {
                    myMask.hide();
                }
                if (response.status == 401) {
                    Ext.Msg.alert('当前请求需要用户验证!');
                } else if (response.status == 404) {
                    Ext.Msg.alert('未找到请求资源!');
                } else if (response.status == 408) {
                    Ext.Msg.alert('请求超时!');
                } else {
                    Ext.Msg.alert('发送请求失败！' + response.status);
                }
                console.log(response);
            }

        }
        if (!Ext.isEmpty(productList.collection)) {
            Ext.Ajax.request(requestConfig);

        } else {
            if (myMask != undefined) {
                myMask.hide();
            }
            Ext.Msg.alert('提示', pageName + ':生成页面失败,请选择产品！');
        }
    },
    /**
     * 显示生成页面时响应信息的窗口
     * @param {Object} data 响应的信息
     * @param {Object} selectProductData product类型页面选择的产品信息
     * @param {String} pageName 单选生成product类型页面的名字
     * @param {Array} pageList 批量生成时，所选的页面集合
     */
    createResponseDataWin: function (data, selectProductData, pageName, pageList, cmspageStore) {
        var me = this;
        Ext.create('CGP.cmspage.view.ResponseDataWin', {
            data: data,
            selectProductData: selectProductData,
            pageName: pageName,
            pageList: pageList,
            controller: me,
            cmspageStore: cmspageStore
        })
    },
    /**
     * 显示页面的分页变量窗口
     * @param {Model} record 当前选中的记录
     */
    showCmsVariable: function (record) {
        var me = this;
        var pageId = record.get('id');
        Ext.create('CGP.cmspage.view.cmsvariable.CmsVariableWin', {
            controller: me,
            record: record,
            pageId: pageId
        }).show();
    },
    /**
     * 添加分页变量的窗口
     * @param {Array} data 选中页面分页变量的所有记录
     * @param {Store} store 选中的页面的store
     */
    showAddCmsVariableWin: function (data, store, pageId, record) {
        var me = this;
        Ext.create('CGP.cmspage.view.cmsvariable.AddCmsVariableWin', {
            data: data,
            store: store,
            record: record,
            pageId: pageId,
            controller: me
        }).show();
    },
    /**
     * 为页面添加分页变量
     * @param {CGP.cmspage.view.cmsvariable.AddCmsVariableWin} window 添加分页变量的窗口
     */
    addCmsVariable: function (window) {
        var addCollection = window.getComponent('addCmsVariable').collection;
        var addCmsVariable = [];
        for (var i = 0; i < addCollection.length; i++) {
            addCmsVariable.push(addCollection.keys[i]);
        }
        var jsonData = {'variableIds': addCmsVariable}
        Ext.Ajax.request({
            url: adminPath + 'api/cmsPages/' + window.pageId + '/variables',
            method: 'PUT',
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            jsonData: jsonData,
            callback: function (options, success, response) {
                if (success) {
                    Ext.Msg.alert('提示', '添加成功!', function callback() {
                        window.store.load();
                        addCollection.clear();
                        window.close();
                    });
                } else {
                    var resp = Ext.JSON.decode(response.responseText);
                    Ext.Msg.alert(i18n.getKey('prompt'), resp.data.message);
                }
            }
        })
    },
    /**
     * 删除页面的分页变量
     * @param {CGP.cmspage.view.cmsvariable.CmsVariableWin} window 显示页面分页变量的窗口
     */
    deleteCmsVariable: function (window) {
        var collection = window.getComponent('pageCmsVariableGrid').collection;
        var params;
        var records = [];
        for (var i = 0; i < collection.length; i++) {
            if (i == 0) {
                params = 'variableIds=' + collection.keys[0];
            } else {
                params = params + '&variableIds=' + collection.keys[i];
            }
            records.push(window.down("grid").getStore().getById(collection.keys[i]));
        }
        Ext.MessageBox.confirm('提示', '是否删除选中的分页变量?', callBack);

        function callBack(id) {
            //var selected = me.getSelectionModel().getSelection();
            if (id === "yes") {
                Ext.Ajax.request({
                    url: adminPath + 'api/cmsPages/' + window.pageId + '/variables?' + params,
                    method: 'DELETE',
                    headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                    callback: function (options, success, response) {
                        if (success) {

                            window.down("grid").getStore().remove(records);
                            collection.clear();
                            //configuredProductWin.close();

                        } else {
                            var resp = Ext.JSON.decode(response.responseText);
                            Ext.Msg.alert(i18n.getKey('prompt'), resp.data.message);
                        }
                    }
                })
            } else {
                close();
            }
        }
    },
    uploadStaticResource: function (websiteId, files, window) {
        var lm = window.setLoading();
        Ext.Ajax.request({
            url: adminPath + 'api/cmsPages/staticResource',
            method: 'POST',
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            jsonData: {websiteId: websiteId, files: files},
            success: function (rep) {
                lm.hide();
                var response = Ext.JSON.decode(rep.responseText);
                if (response.success) {
                    Ext.Msg.alert('提示', '上传成功！', function () {
                        window.close();
                    });
                } else {
                    Ext.Msg.alert('提示', '上传失败！' + response.data.message);
                }
            },
            failure: function (resp) {
                lm.hide();
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        })
    },
    saveCmsPage: function (items, cmspageModel, mask) {
        var me = this, method = "POST", url;
        var data = {};
        Ext.Array.each(items, function (item) {
            if (item.type == 'query' || item.type == 'filter') {
                item.save();
            }
        });
        Ext.Array.each(items, function (item) {
            if (item.diyGetValue) {
                data[item.name] = item.diyGetValue();
            } else {
                data[item.name] = item.getValue();
            }
        });
//		object.promotionId = 1;
        url = adminPath + 'api/cmsPages';
        if (cmspageModel != null &&
            cmspageModel.modelName == "CGP.cmspage.model.CmsPage"
            && cmspageModel.get("id") != null) {

            data.id = cmspageModel.get("id");
            method = "PUT";
            url = url + "/" + data.id;
        }

        Ext.Ajax.request({
            url: url,
            method: method,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            jsonData: data,
            success: function (response, options) {
                var resp = Ext.JSON.decode(response.responseText);
                if (resp.success) {
                    mask.hide();
                    Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('saveSuccess'), function () {
                        var id = resp.data.id;
                        var htmlUrl = path + "partials/cmspage/edit.html?id=" + id;
                        JSOpen({
                            id: "cmspage_edit",
                            url: htmlUrl,
                            title: i18n.getKey('edit') + "_" + i18n.getKey('cmspage'),
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
    },
    managerQueryOrFilter: function (Id, type, title, cmspageId) {
        var me = this;
        var url;
        if (type == 'query') {
            url = adminPath + 'api/cmsEntityQuery/' + Id
        } else {
            url = adminPath + 'api/cmsEntityFilters/' + Id
        }
        var request = {
            url: url,
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (response, options) {
                var data = Ext.decode(response.responseText).data;
                Ext.create('CGP.cmspublishgoals.view.options.ManagerQueryOrFilter', {
                    title: i18n.getKey('manager') + i18n.getKey(title),
                    data: data,
                    controller: me,
                    type: type
                }).show();
            },
            failure: function (response, options) {
                var object = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('saveFailure') + object.data.message);
            }
        };
        if (Ext.isEmpty(Id)) {
            Ext.Msg.confirm(i18n.getKey('prompt'), '没有' + title + ',检查此cmspage?', callback);

            function callback(id) {
                if (id === 'yes') {
                    JSOpen({
                        id: "cmspage_edit",
                        url: path + "partials/cmspage/edit.html?id=" + cmspageId,
                        title: i18n.getKey('edit') + "_" + i18n.getKey('cmspage'),
                        refresh: true
                    })
                }
            }
        } else {
            Ext.Ajax.request(request);
        }
    },
    saveQueryOrFilter: function (data, win, type) {
        var url;
        if (type == 'query') {
            url = adminPath + 'api/cmsEntityQuery/' + data.id;
        } else if (type == 'filter') {
            url = adminPath + 'api/cmsEntityFilters/' + data.id
        }
        Ext.Ajax.request({
            url: url,
            method: 'PUT',
            jsonData: data,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (response, options) {
                Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('savesuccess'));
                win.close();
            },
            failure: function (response, options) {
                var object = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('saveFailure') + object.data.message);
            }
        })
    }
})