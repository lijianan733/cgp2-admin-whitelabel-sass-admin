/**
 * Created by nan on 2018/3/9.
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.controller.Controller', {

    getAllPrepareDataForValidate: function () {
        var allRecord = [];
        var data = {
            IdPathSelector: [],
            MaterialIdSelector: [],
            JsonPathSelector: [],
            ExpressionSelector: []
        }
    },

    Compare: function (objA, objB) {
        function isObj(object) {
            return object && typeof (object) == 'object' && Object.prototype.toString.call(object).toLowerCase() == "[object object]";
        }

        function isArray(object) {
            return object && typeof (object) == 'object' && object.constructor == Array;
        }

        function getLength(object) {
            var count = 0;
            for (var i in object) count++;
            return count;
        }

        function CompareObj(objA, objB, flag) {
            for (var key in objA) {
                if (!flag) //跳出整个循环
                    break;
                if (!objB.hasOwnProperty(key)) {
                    flag = false;
                    break;
                }
                if (!isArray(objA[key])) { //子级不是数组时,比较属性值
                    if (objB[key] != objA[key]) {
                        flag = false;
                        break;
                    }
                } else {
                    if (!isArray(objB[key])) {
                        flag = false;
                        break;
                    }
                    var oA = objA[key],
                        oB = objB[key];
                    if (oA.length != oB.length) {
                        flag = false;
                        break;
                    }
                    if (oA.length == oB.length && oB.length == 0) {
                        flag = true;
                    } else {
                        for (var k in oA) {
                            if (!flag) //这里跳出循环是为了不让递归继续
                                break;
                            flag = CompareObj(oA[k], oB[k], flag);
                        }
                    }
                }
            }
            return flag;
        }

        if (!isObj(objA) || !isObj(objB)) return false; //判断类型是否正确
        if (getLength(objA) != getLength(objB)) return false; //判断长度是否一致
        return CompareObj(objA, objB, true); //默认为true
    },
    /**
     * 获取pcs预处理配置
     */
    getPcsConfig: function (designConfigId, sourceId) {
        var filterData = Ext.JSON.encode([{
            "name": "designId",
            "type": "number",
            "value": designConfigId
        }, {
            "name": "sourceId",
            "type": "string",
            "value": sourceId
        }]);
        var pscConfig = null;
        var url = adminPath + 'api/pagecontentschemapreprocessconfig?page=1&start=0&limit=1000&filter=' + filterData;
        JSAjaxRequest(url, 'GET', false, null, null, function (require, success, response) {
            var responseText = Ext.JSON.decode(response.responseText);
            if (responseText.success && responseText.data) {
                pscConfig = responseText.data.content[0];
            } else {
                Ext.Msg.alert('提示', '请求失败！' + responseText.data.message);
            }
        })
        return pscConfig;
    },
    judgeHavePcsConfig: function (designConfigId, sourceId, builderConfigTab, mask) {
        var filterData = Ext.JSON.encode([{
            "name": "designId",
            "type": "number",
            "value": designConfigId
        }, {
            "name": "sourceId",
            "type": "string",
            "value": sourceId
        }]);
        Ext.Ajax.request({
            url: encodeURI(adminPath + 'api/pagecontentschemapreprocessconfig?page=1&start=0&limit=1000&filter=' + filterData),
            method: 'GET',
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            //async: false,
            success: function (rep) {
                var response = Ext.JSON.decode(rep.responseText);
                if (response.success) {
                    var data = response.data;
                    if (Ext.isEmpty(data.content)) {
                        Ext.Msg.confirm(i18n.getKey('prompt'), '当前的pcs配置为空，是否新建该配置?', function (select) {
                            if (select == 'yes') {
                                Ext.Ajax.request({
                                    url: adminPath + 'api/pagecontentschemapreprocessconfig',
                                    method: 'POST',
                                    jsonData: {
                                        clazz: 'com.qpp.cgp.domain.pcspreprocess.config.PageContentSchemaTemplatePreprocessConfig',
                                        designId: designConfigId,
                                        sourceId: sourceId,
                                        pcsPreprocessPlaceholderConfigs: []
                                    },
                                    headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                                    success: function (rep) {
                                        var response = Ext.JSON.decode(rep.responseText);
                                        if (response.success) {
                                            mask.hide();
                                            builderConfigTab.managerPcsPreprocessConfig(sourceId);
                                        } else {
                                            mask.hide();
                                            Ext.Msg.alert('提示', '请求失败！' + response.data.message);
                                        }
                                    },
                                    failure: function (resp) {
                                        mask.hide();
                                        var response = Ext.JSON.decode(resp.responseText);
                                        Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                                    }
                                });
                            } else {
                                mask.hide();
                            }
                        })

                    } else {
                        mask.hide();
                        builderConfigTab.managerPcsPreprocessConfig(sourceId);
                    }
                } else {
                    mask.hide();
                    Ext.Msg.alert('提示', '请求失败！' + response.data.message);
                }
            },
            failure: function (resp) {
                mask.hide();
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        });
    },
    deletePcsConfig: function (pscConfigId) {
        var controller = this;
        Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('deleteConfirm'), function (selector) {
            if (selector == 'yes') {
                var url = adminPath + 'api/pagecontentschemapreprocessconfig/' + pscConfigId;
                JSAjaxRequest(url, 'DELETE', false, null, i18n.getKey('deleteSuccess'), function () {

                })
            }
        })
    },

    editJsonCustomize:function (data, store, editOrNew, productConfigDesignId, productBomConfigId){
        var tabpanel = window.parent.Ext.getCmp('builderConfigTab');
        var url = path + 'partials/product/productconfig/productdesignconfig/jsoncustomizeconfig/edit.html?editOrNew=' + editOrNew + '&id=' + (data == null ? 0 : data._id) + '&productConfigDesignId=' + productConfigDesignId;

        var title = i18n.getKey(editOrNew) + i18n.getKey('jsonCustomizeConfig');
        var tab = tabpanel.getComponent('editJsonCustomizeConfig')
        if (tab == null) {
            var tab = tabpanel.add({
                id: 'editJsonCustomizeConfig',
                title: title,
                html: '<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
                closable: true
            });
        } else {
            tab.setTitle(title);
            tab.update('<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>');

        }
        tabpanel.setActiveTab(tab);
    },
    saveJsonCustomize:function (data,mask,form){
        var url = adminPath + 'api/jsonCustomizeConfigs',method='POST';
        if(data?._id){
            url = adminPath + 'api/jsonCustomizeConfigs/'+data._id;
            method='PUT';
        }
        Ext.Ajax.request({
            url: url,
            method: method,
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            //async: false,
            jsonData:data,
            success: function (rep) {
                var response = Ext.JSON.decode(rep.responseText);
                if (response.success) {
                    mask.hide();
                    form.getComponent('_id').setValue(response.data['_id'])
                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('saveSuccess'));
                } else {
                    mask.hide();
                    Ext.Msg.alert('提示', '请求失败！' + response.data.message);
                }
            },
            failure: function (resp) {
                mask.hide();
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        });
    },
    deleteJsonCustomize: function (id,store) {
        var controller = this;
        Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('deleteConfirm'), function (selector) {
            if (selector == 'yes') {
                var url = adminPath + 'api/jsonCustomizeConfigs/' + id;
                JSAjaxRequest(url, 'DELETE', false, null, i18n.getKey('deleteSuccess'), function (require, success, response) {
                    if(success){
                        store.load();
                    }
                    else{
                        Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                    }
                })
            }
        })
    },
})

