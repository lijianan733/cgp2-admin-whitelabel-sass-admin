/**
 * @author xiu
 * @date 2024/12/31
 */
Ext.define('CGP.currencyconfig.controller.Controller', {
    id: JSGetQueryString('id'),

    //修改
    editQuery: function (url, jsonData, isEdit, attributeVersionId) {
        var data = [],
            method = isEdit ? 'PUT' : 'POST',
            successMsg = method === 'POST' ? 'addsuccessful' : 'saveSuccess';

        JSAjaxRequest(url, method, false, jsonData, false, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    data = responseText?.data?.content || responseText?.data;
                }
            }
        }, true, attributeVersionId);
        return data
    },

    //查询
    getQuery: function (url, attributeVersionId) {
        var data = [];

        JSAjaxRequest(url, 'GET', false, null, null, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    data = responseText?.data?.content || responseText?.data;
                }
            }
        }, false, attributeVersionId);
        return data;
    },

    //删除
    deleteQuery: function (url, callBack) {
        JSAjaxRequest(url, 'DELETE', false, null, null, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    callBack && callBack();
                }
            }
        }, true)
    },

    //获取url
    getUrl: function (author, params) {
        const id = params?.id;
        var urlGather = {
            mainUrl: 'api/colors',
            addPart: 'addPart',
            deletePart: 'deletePart',
            selectPart: 'selectPart' + id,
            deletePartGrid: 'deletePartGrid' + id
        }
        return adminPath + urlGather[author];
    },

    //异步修改存在加载动画
    asyncEditQuery: function (url, jsonData, isEdit, callFn, hideMsg, attributeVersionId) {
        var method = isEdit ? 'PUT' : 'POST',
            successMsg = method === 'POST' ? 'addsuccessful' : 'saveSuccess';


        JSAjaxRequest(url, method, true, jsonData, !hideMsg && successMsg, callFn, true, attributeVersionId);
    },

    // 过滤属性版本的get请求
    getAttributeVersionQuery: function (url, attributeVersionId) {
        var data = [];

        JSAjaxRequestForAttributeVersion(url, 'GET', false, null, null, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    data = responseText?.data?.content || responseText?.data;
                }
            }
        }, false, attributeVersionId);
        return data;
    },

    // 过滤属性版本的edit请求
    editAttributeVersionQuery: function (url, jsonData, isEdit, attributeVersionId) {
        var data = [],
            method = isEdit ? 'PUT' : 'POST',
            successMsg = method === 'POST' ? 'addsuccessful' : 'saveSuccess';

        JSAjaxRequestForAttributeVersion(url, method, false, jsonData, false, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    data = responseText?.data?.content || responseText?.data;
                }
            }
        }, true, attributeVersionId);
        return data
    },

    // 过滤属性版本的edit请求
    asyncEditAttributeVersionQuery: function (url, jsonData, isEdit, callFn, hideMsg, attributeVersionId) {
        var method = isEdit ? 'PUT' : 'POST',
            successMsg = method === 'POST' ? 'addsuccessful' : 'saveSuccess';


        JSAjaxRequestForAttributeVersion(url, method, true, jsonData, !hideMsg && successMsg, callFn, true, attributeVersionId);
    },

    /**
     * 转换时间格式
     * @param time 时间
     */
    getEndTime: function (time) {
        if (!time) {
            return '未查询到信息 '
        }
        return Ext.Date.format(new Date(+time), 'Y-m-d G:i:s')
    },

    getStoreSelectDataIds: function (store) {
        var data = store.proxy.data,
            selectIds = data.map(item => {
                return item['id'];
            })
        return selectIds;
    },

    getCurrencyData: function () {
        var url = adminPath + 'api/currencies?page=1&limit=10000&filter=' + Ext.JSON.encode([
                {
                    name: "website.id",
                    type: "number",
                    value: 11,
                }
            ]),
            queryData = JSGetQuery(url);

        return queryData;
    },

    getFilterFilterIdsData: function (array, filterIds) {
        return array.filter(item => {
            return !filterIds.includes(item.id);
        })
    },

    createCurrencyWin: function (store) {
        var controller = this,
            getFilterIds = controller.getStoreSelectDataIds(store);

        return Ext.create('Ext.window.Window', {
            layout: 'fit',
            modal: true,
            constrain: true,
            title: i18n.getKey('选择_货币'),
            width: 950,
            height: 500,
            items: [
                {
                    xtype: 'createCurrencyGridWindow',
                    name: 'grid',
                    itemId: 'grid',
                    getFilterIds: getFilterIds
                },
            ],
            bbar: {
                xtype: 'bottomtoolbar',
                saveBtnCfg: {
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt,
                            grid = win.getComponent('grid'),
                            selectedRecord = grid.grid.getSelectionModel().getSelection()

                        if (selectedRecord.length) {
                            selectedRecord.forEach(item => {
                                store.proxy.data.push(item.getData());
                            })
                            store.load();
                            win.close();
                        } else {
                            Ext.Msg.alert('提示', '请至少选择一条数据!')
                        }
                    }
                }
            },
        }).show();
    },

    createExchangeRateHedgeConfigWindow: function (callBack) {
        var controller = this,
            websiteMode = JSGetQueryString('websiteMode'),
            isStageWebsite = websiteMode === 'Stage';

        return Ext.create('Ext.window.Window', {
            layout: 'fit',
            modal: true,
            constrain: true,
            title: i18n.getKey('选择_汇率套'),
            width: 1100,
            height: 500,
            items: [
                {
                    xtype: 'createExchangeRateHedgeConfigWindow',
                    name: 'grid',
                    itemId: 'grid',
                    isStageWebsite: isStageWebsite
                },
            ],
            bbar: {
                xtype: 'bottomtoolbar',
                saveBtnCfg: {
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt,
                            grid = win.getComponent('grid'),
                            selectedRecord = grid.grid.getSelectionModel().getSelection()

                        if (selectedRecord.length) {
                            var selectedData = selectedRecord[0].getData();

                            callBack && callBack(selectedData);
                            win.close();
                        } else {
                            Ext.Msg.alert('提示', '请选择一条数据!')
                        }
                    }
                }
            },
        }).show();
    },

    getSelectExchangeRateHedgeData: function (id) {
        var controller = this,
            url = adminPath + `api/exchangeRateSets/${id}`,
            queryData = controller.getQuery(url);

        return controller.getSelectRecord(queryData['exchangeRates']);
    },

    setExchangeRateHedgeConfigData: function (selectedData, store, deleteExchangeRateConfig) {
        var controller = this,
            {id, version} = selectedData

        store.proxy.data = controller.getSelectExchangeRateHedgeData(id);
        store.load();
        deleteExchangeRateConfig.diySetValue(version);
    },

    getSelectRecord: function (data) {
        if (data) {
            return data.map(item => {
                var {
                    _id,
                    clazz,
                    outputCurrencyCode,
                    inputCurrencyCode,
                    exchangeRateSetId,
                    inputRate,
                    outRate
                } = item;

                return {
                    _id,
                    clazz,
                    outputCurrencyCode,
                    inputCurrencyCode,
                    exchangeRateSetId,
                    exchangeRate: {
                        min: inputRate,
                        max: outRate,
                    }
                }
            });
        }
    },
})