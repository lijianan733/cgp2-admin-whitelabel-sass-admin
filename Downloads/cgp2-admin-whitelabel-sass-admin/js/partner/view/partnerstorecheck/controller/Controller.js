/**
 * @author xiu
 * @date 2025/5/15
 */
Ext.Loader.syncRequire([
    'CGP.promotion.view.DateRangeV2',
])
Ext.define('CGP.partner.view.partnerstorecheck.controller.Controller', {
    compGather: {
        '标题项': 'Ext.ux.form.field.CreateTitleItem',
        'window下一步功能': 'Ext.ux.form.field.CreateNextStepWindow',
        'combo切换模板功能': 'Ext.ux.form.field.CreateChangeCombo',
        '范围输入框': 'Ext.ux.form.field.MinMaxField',
        '拉取中组件': 'Ext.ux.form.field.CreateLoadingComp',
    },

    //修改
    editQuery: function (url, jsonData, isEdit, otherConfig) {
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
        }, true, otherConfig);
        return data
    },

    //查询
    getQuery: function (url, otherConfig) {
        var data = [];

        JSAjaxRequest(url, 'GET', false, null, null, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    data = responseText?.data?.content || responseText?.data;
                }
            }
        }, false, otherConfig);
        return data;
    },

    //删除
    deleteQuery: function (url, callBack, otherConfig) {
        JSAjaxRequest(url, 'DELETE', false, null, null, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    callBack && callBack();
                }
            }
        }, true, otherConfig)
    },

    //异步修改存在加载动画
    asyncEditQuery: function (url, jsonData, isEdit, callFn, hideMsg, otherConfig) {
        var method = isEdit ? 'PUT' : 'POST',
            successMsg = method === 'POST' ? 'addsuccessful' : 'saveSuccess';

        JSAjaxRequest(url, method, true, jsonData, !hideMsg && successMsg, callFn, true, otherConfig);
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
    asyncEditAttributeVersionQuery: function (url, jsonData, isEdit, callFn, hideMsg, attributeVersionId) {
        var method = isEdit ? 'PUT' : 'POST',
            successMsg = method === 'POST' ? 'addsuccessful' : 'saveSuccess';

        JSAjaxRequestForAttributeVersion(url, method, true, jsonData, !hideMsg && successMsg, callFn, true, attributeVersionId);
    },

    // 创建form窗口
    createFormWindow: function (data, callBack) {
        var controller = this,
            id = data.id,
            isEdit = !!data;

        return Ext.create('Ext.window.Window', {
            layout: 'fit',
            modal: true,
            constrain: true,
            title: i18n.getKey('xxxx'),
            width: 800,
            height: 400,
            items: [
                {
                    xtype: 'errorstrickform',
                    itemId: 'form',
                    defaults: {
                        margin: '10 25 5 25',
                        allowBlank: true
                    },
                    layout: 'vbox',
                    diyGetValue: function () {
                        var me = this,
                            result = {},
                            items = me.items.items;
                        items.forEach(item => {
                            var name = item['name'];
                            result[name] = item.diyGetValue ? item.diyGetValue() : item.getValue()
                        })
                        return result;
                    },
                    diySetValue: function (data) {
                        var me = this,
                            items = me.items.items;
                        items.forEach(item => {
                            var {name} = item;
                            item.diySetValue ? item.diySetValue(data[name]) : item.setValue(data[name])
                        })
                    },
                    items: [],
                    listeners: {
                        afterrender: function (comp) {
                            data && comp.diySetValue(data);
                        }
                    }
                },
            ],
            bbar: {
                xtype: 'bottomtoolbar',
                saveBtnCfg: {
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt,
                            suffixUrl = isEdit ? '' : 'api/smtManufactureCenterSelectConfigs',
                            url = adminPath + suffixUrl,
                            form = win.getComponent('form'),
                            formData = form.diyGetValue(),
                            result = {};


                        if (form.isValid()) {
                            console.log(formData);
                            controller.asyncEditQuery(url, result, isEdit, function (require, success, response) {
                                if (success) {
                                    var responseText = Ext.JSON.decode(response.responseText);
                                    if (responseText.success) {
                                        callBack && callBack(responseText.data);
                                        win.close();
                                    }
                                }
                            })
                        }
                    }
                }
            },
        }).show();
    },

    // 创建grid窗口
    createGridWindow: function (store, callBack) {
        var controller = this
        return Ext.create('Ext.window.Window', {
            layout: 'fit',
            modal: true,
            constrain: true,
            title: i18n.getKey('xxxx'),
            width: 800,
            height: 400,
            items: [
                {
                    xtype: 'searchcontainer',
                    name: 'searchcontainer',
                    itemId: 'searchcontainer',
                    filterCfg: {
                        height: 60,
                        layout: {
                            type: 'table',
                            columns: 2
                        },
                        defaults: {
                            isLike: false
                        },
                        items: [
                            {
                                xtype: 'textfield',
                                name: '_id',
                                itemId: 'id',
                                fieldLabel: i18n.getKey('id'),
                            },
                            {
                                xtype: 'textfield',
                                name: 'name',
                                itemId: 'name',
                                fieldLabel: i18n.getKey('name'),
                            },
                            {
                                xtype: 'textfield',
                                name: 'displayName',
                                fieldLabel: i18n.getKey('displayName'),
                                itemId: 'displayName'
                            },
                        ]
                    },
                    gridCfg: {
                        editAction: true,
                        deleteAction: true,
                        store: store,
                        columnDefaults: {
                            tdCls: 'vertical-middle',
                            align: 'center',
                            renderer: function (value, metadata, record) {
                                metadata.tdAttr = 'data-qtip ="' + value + '"';
                                return value
                            }
                        },
                        editActionHandler: function (grid, rowIndex, colIndex) {

                        },
                        deleteActionHandler: function (view, colInde, rowInde, el, event, record, dom) {

                        },
                        tbar: [
                            {
                                text: i18n.getKey('add'),
                                iconCls: 'icon_add',
                                handler: function (btn) {

                                }
                            },
                            {
                                text: i18n.getKey('delete'),
                                iconCls: 'icon_delete',
                                handler: function (btn) {

                                }
                            }
                        ],
                        columns: [
                            {
                                text: i18n.getKey('id'),
                                dataIndex: '_id',
                                width: 180,
                                tdCls: 'vertical-middle',
                                itemId: 'id',
                                sortable: true
                            },
                            {
                                text: i18n.getKey('name'),
                                dataIndex: 'name',
                                width: 180,
                                itemId: 'name',
                            },
                            {
                                text: i18n.getKey('displayName'),
                                dataIndex: 'displayName',
                                flex: 1,
                                itemId: 'displayName',
                            },
                        ]
                    }
                }
            ],
            bbar: {
                xtype: 'bottomtoolbar',
                saveBtnCfg: {
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt,
                            suffixUrl = 'api/smtManufactureCenterSelectConfigs',
                            url = adminPath + suffixUrl,
                            searchcontainer = win.getComponent('searchcontainer'),
                            selected = searchcontainer.grid.getSelectionModel().getSelection(),
                            result = {};

                        if (selected?.length) {
                            controller.asyncEditQuery(url, result, false, function (require, success, response) {
                                if (success) {
                                    var responseText = Ext.JSON.decode(response.responseText);
                                    if (responseText.success) {
                                        callBack && callBack(responseText.data);
                                        win.close();
                                    }
                                }
                            })
                        } else {
                            Ext.Msg.alert('提示', '请至少选择一条数据!')
                        }
                    }
                }
            },
        }).show();
    },

    // 接收iframe信息 用于tab点击时会传递点击回调{type: 'selected',args: true}
    getIframeInfoFn: function (message, callBack, overTime) {
        // 设置加载超时处理
        var loadTime = setTimeout(() => {
            JSSetLoading(false);
            Ext.Msg.alert('提示', message, function () {
                location.reload();
            });
        }, overTime)

        window.addEventListener('message', function (e) {
            try {
                // 清理超时定时器
                callBack && callBack(e, loadTime);
            } catch (error) {
                console.log(error);
            }
        });
    },

    //获取过滤key value后的对象
    getFilteredValues: function (filters, data) {
        var result = new Set(); // 使用 Set 来存储唯一值

        data.forEach(item => {
            filters.forEach(filterItem => {
                var {name, value, type, operator} = filterItem,
                    isExactMatch = operator === 'exactMatch',
                    isValue = item[name] === value,
                    isType = (typeof item[name]) === type;

                // 根据是否开启精确匹配或模糊匹配来判断
                if (isExactMatch) {
                    isValue = item[name] === value; // 精确匹配
                } else {
                    if (typeof item[name] === 'string') {
                        isValue = item[name].includes(value); // 模糊匹配
                    } else {
                        isValue = item[name] === value; // 精确匹配
                    }
                }

                if (isValue && isType) {
                    result.add(JSON.stringify(item)); // 使用 JSON.stringify 保证对象唯一性
                }
            })
        })

        // 将 Set 转换回数组并解析 JSON 字符串
        return Array.from(result).map(item => JSON.parse(item));
    },

    getTime: function (time) {
        const date = new Date(time);
        const dateString = date.toISOString();
        return dateString.replace('Z', '+08:00');
    },

    // 获取报关Id
    getCustomsDeclarationId: function (arr) {
        var arrStr = [];
        Ext.Array.each(arr, function (item) {
            Ext.Array.each(item.items, function (itema) {
                arrStr.push(itema.orderItem._id);
            });
        });
        return arrStr;
    },

    getCustomsCategoryDTOList: function (orderId) {
        var controller = this,
            url = adminPath + `api/orders/${orderId}/lineItems/v2`,
            data = controller.getQuery(url),
            result = [];

        if (data?.length) {
            result = data[0]['customsCategoryDTOList'];
        }

        return result;
    },


    setCustomsDeclarationType: function (orderId, form) {
        var controller = this,
            customsCategoryDTOList = controller.getCustomsCategoryDTOList(orderId),
            customsDeclarationType = {
                xtype: 'combo',
                name: 'customsDeclarationType',
                itemId: 'customsDeclarationType',
                fieldLabel: i18n.getKey('报关分类'),
                valueField: '_id',
                displayField: 'outName',
                editable: false,
                allowBlank: false,
                store: {
                    fields: [
                        '_id', 'outName'
                    ],
                    data: customsCategoryDTOList
                }
            }

        form.insert(2, customsDeclarationType);
    },

    getCustomsDeclarationResult: function (customsDeclarationIds, customsDeclarationTypeId) {
        var controller = this,
            result = [];
        customsDeclarationIds.forEach(item => {
            result.push({
                orderLineItemId: item,
                customCategoryId: customsDeclarationTypeId
            })
        })
        return result;
    },

    /**
     * 创建导出店铺信息报表表单窗口
     * @param data
     * @param key
     * @param callBack
     * @returns {Ext.Component}
     */
    createExportStoreInfoFormWindow: function (data, key, callBack) {
        var controller = this,
            isEdit = !!data,
            id = isEdit ? data[key] : '';

        console.log(data);
        return Ext.create('Ext.window.Window', {
            layout: 'fit',
            modal: true,
            constrain: true,
            title: i18n.getKey('导出店铺信息报表'),
            width: 450,
            items: [
                {
                    xtype: 'errorstrickform',
                    itemId: 'form',
                    defaults: {
                        margin: '10 25 5 25',
                        allowBlank: false,
                        isFilterComp: false,
                    },
                    layout: 'vbox',
                    diyGetValue: function () {
                        var me = this,
                            result = {},
                            items = me.items.items;

                        items.forEach(item => {
                            var {name, isFilterComp} = item;

                            if (!isFilterComp) {
                                result[name] = item.diyGetValue ? item.diyGetValue() : item.getValue();
                            }
                        })

                        return result;
                    },
                    diySetValue: function (data) {
                        var me = this,
                            items = me.items.items;

                        items.forEach(item => {
                            var {name, isFilterComp} = item;

                            if (!isFilterComp) {
                                item.diySetValue ? item.diySetValue(data[name]) : item.setValue(data[name]);
                            }
                        })
                    },
                    items: [
                        {
                            xtype: 'daterange',
                            name: 'effectiveTime',
                            itemId: 'effectiveTime',
                            editable: false,
                            allowBlank: false,
                            defaults: {
                                editable: false,
                                allowBlank: false,
                            },
                            fieldLabel: i18n.getKey('导出时间范围'),
                            width: 360,
                            diyGetValue: function () {
                                var me = this,
                                    result = [],
                                    items = me.items.items;

                                items.forEach(item => {
                                    var {name} = item;
                                    if (name) {
                                        var itemValue = item.diyGetValue ? item.diyGetValue() : item.getValue(),
                                            time = itemValue ? Ext.Date.format(new Date(itemValue), "Y-m-d") : '';
                                        
                                        result.push(time);
                                    }
                                })
                                
                                return {
                                    startDate: result[0],
                                    endDate: result[1]
                                };
                            },
                            diySetValue: function (data) {
                                var me = this,
                                    items = me.items.items;

                                items.forEach(item => {
                                    var {name, isFilterComp} = item;

                                    console.log(name)
                                    if (!isFilterComp) {
                                        item.diySetValue ? item.diySetValue(data[name]) : item.setValue(data[name]);
                                    }
                                })
                            },
                            format: 'Y/m/d',
                        },
                    ],
                    listeners: {
                        afterrender: function (comp) {
                            data && comp.diySetValue(data);
                        }
                    }
                },
            ],
            bbar: {
                xtype: 'bottomtoolbar',
                saveBtnCfg: {
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt,
                            form = win.getComponent('form'),
                            formData = form.diyGetValue();

                        if (form.isValid()) {
                            console.log(formData);
                            callBack && callBack(win, formData);
                        }
                    }
                }
            },
        }).show();
    },


    downLoadExcelFn: function (fileUrl, fileName, formData, mimeType, onSuccess) {
        var x = new XMLHttpRequest();
        x.open("POST", fileUrl, true);
        x.setRequestHeader('Content-Type', 'application/json');
        x.setRequestHeader('Access-Control-Allow-Origin', '*');
        x.setRequestHeader('Authorization', 'Bearer ' + Ext.util.Cookies.get('token'));
        x.responseType = 'blob';
        JSSetLoading(true);
        x.onload = function (e) {
            if (x.status === 200) {
                const blob = new Blob([x.response], {type: mimeType || x.response.type});
                var url = window.URL.createObjectURL(blob);
                var a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                a.click();
                JSShowNotification({
                    type: 'success',
                    title: '数据导出成功!',
                    callback: onSuccess || Ext.emptyFn
                });
            } else {
                const reader = new FileReader();
                reader.onload = function (event) {
                    var responseText = Ext.JSON.decode(event.target.result);
                    JSShowNotification({
                        type: 'error',
                        title: '错误信息',
                        text: responseText?.data?.message
                    });
                };
                reader.readAsText(x.response);
            }
            JSSetLoading(false);
        };
        x.onerror = function () {
            JSShowNotification({
                type: 'error',
                title: '网络错误',
                text: '请求失败，请检查网络连接'
            });
            JSSetLoading(false);
        };
        x.send(Ext.encode(formData)); // 直接发送FormData对象
    }

})