/**
 * @author xiu
 * @date 2025/7/30
 */
Ext.Loader.syncRequire([
    'CGP.cmslog.store.CategoryTreeStore',
])
Ext.define('CGP.websiteproductlist.controller.Controller', {
    compGather: {
        '标题项': 'Ext.ux.form.field.CreateTitleItem',
        'window下一步功能': 'Ext.ux.form.field.CreateNextStepWindow',
        'combo切换模板功能': 'Ext.ux.form.field.CreateChangeCombo',
        '范围输入框': 'Ext.ux.form.field.MinMaxField',
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
                            result = null,
                            items = me.items.items;
                        items.forEach(item => {
                            result = item.diyGetValue ? item.diyGetValue() : item.getValue()
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
                            formData = form.diySetValue(),
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
                            }, true)
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

    // 发布至release
    changePublishStatusWin: function (isRelease, productId, settingId, callBack, elseBack) {
        var controller = this,
            url = adminPath + `api/products/${productId}/store-settings/${settingId}/partial`, //部分修改
            confirmMsg = isRelease ? '是否确认取消发布至release?' : '是否确认发布至release?',
            alertMsg = isRelease ? '取消成功!' : '发布成功!',
            params = {
                clazz: 'com.qpp.cgp.domain.product.config.ProductDefaultSettingForStore',
                isRelease: !isRelease //取反提交
            };

        Ext.Msg.confirm('提示', confirmMsg, function (selector) {
            if (selector === 'yes') {
                controller.asyncEditQuery(url, params, true, function (require, success, response) {
                    if (success) {
                        var responseText = Ext.JSON.decode(response.responseText);
                        if (responseText.success) {
                            const data = responseText.data;
                            Ext.Msg.alert('提示', alertMsg, function () {
                                callBack && callBack(data);
                            });
                        }
                    }
                })
            } else {
                elseBack && elseBack();
            }
        })
    },

    // 切换至生效
    changeStatusWin: function (isActived, productId, settingId, callBack) {
        var controller = this,
            url = adminPath + `api/products/${productId}/store-settings/${settingId}/partial`, //部分修改
            confirmMsg = isActived ? '是否切换回草稿?' : '是否切换至生效?',
            alertMsg = '切换成功!',
            params = {
                clazz: 'com.qpp.cgp.domain.product.config.ProductDefaultSettingForStore',
                isActived: !isActived //取反提交
            };

        Ext.Msg.confirm('提示', confirmMsg, function (selector) {
            if (selector === 'yes') {
                controller.asyncEditQuery(url, params, true, function (require, success, response) {
                    if (success) {
                        var responseText = Ext.JSON.decode(response.responseText);
                        if (responseText.success) {
                            const data = responseText.data;
                            Ext.Msg.alert('提示', alertMsg, function () {
                                callBack && callBack(data);
                            });
                        }
                    }
                })
            }
        })
    },

    //查看版本历史
    checkVersionHistoryWin: function (productId, versionedProductAttributeId) {
        var controller = this,
            productUrl = adminPath + `api/products/${productId}/store-settings?page=1&limit=10000&filter=` + Ext.JSON.encode([
                {
                    name: "attributeVersion",
                    value: "false",
                    type: "boolean",
                    operator: "exists"
                }
            ]),
            versionedProductAttributeUrl = adminPath + `api/products/${productId}/store-settings?page=1&limit=10000&filter=` + Ext.JSON.encode([
                {
                    name: 'attributeVersion._id',
                    value: versionedProductAttributeId,
                    type: 'number'
                },
            ]),
            isVersionedProductAttribute = (versionedProductAttributeId && (versionedProductAttributeId !== 'undefined')),
            url = isVersionedProductAttribute ? versionedProductAttributeUrl : productUrl,
            queryData = controller.getQuery(url),
            /*queryData = [
                {
                    id: 263351647,
                    createDate: new Date().getTime(),
                    createUser: '124444@qpp.com',
                    product: {
                        "id": 133829,
                        "type": "Configurable",
                        "model": "michael_test_impression_i18n_03",
                        "name": "michael_test_impression_i18n_03",
                        "salePrice": 25.1,
                        "lowestPrice": 0.65,
                        "dateAvailable": 1638115200000,
                        "mode": "RELEASE",
                        "mainCategory": {
                            "id": 22275365,
                            "name": "QPSON-Playing Cards",
                            "websiteName": "WhiteLabel"
                        },
                        "subCategories": [
                            {
                                "id": 22234468,
                                "name": "QPSON"
                            }
                        ],
                        "websiteName": "WhiteLabel",
                        "clazz": "com.qpp.cgp.domain.product.ConfigurableProduct",
                        "createdDate": 1747893228819,
                        "internal": false,
                        "isFinished": false
                    },
                    attributeVersion: {},
                    version: 1,
                    defaultDetailSetting: {
                        shortDesc: '1111111111',
                        productDesc: '222222222',
                    },
                    isActived: true,
                    isRelease: true,
                },
                {
                    id: 26335164755,
                    createDate: new Date().getTime(),
                    createUser: '124444@qpp.com',
                    product: {
                        "id": 133829,
                        "type": "Configurable",
                        "model": "michael_test_impression_i18n_03",
                        "name": "michael_test_impression_i18n_03",
                        "salePrice": 25.1,
                        "lowestPrice": 0.65,
                        "dateAvailable": 1638115200000,
                        "mode": "RELEASE",
                        "mainCategory": {
                            "id": 22275365,
                            "name": "QPSON-Playing Cards",
                            "websiteName": "WhiteLabel"
                        },
                        "subCategories": [
                            {
                                "id": 22234468,
                                "name": "QPSON"
                            }
                        ],
                        "websiteName": "WhiteLabel",
                        "clazz": "com.qpp.cgp.domain.product.ConfigurableProduct",
                        "createdDate": 1747893228819,
                        "internal": false,
                        "isFinished": false
                    },
                    attributeVersion: {},
                    version: 2,
                    defaultDetailSetting: {
                        shortDesc: '1111111111',
                        productDesc: '222222222',
                    },
                    isActived: true,
                    isRelease: true,
                },
                {
                    id: 2633516475,
                    createDate: new Date().getTime(),
                    createUser: '124444@qpp.com',
                    product: {
                        "id": 133829,
                        "type": "Configurable",
                        "model": "michael_test_impression_i18n_03",
                        "name": "michael_test_impression_i18n_03",
                        "salePrice": 25.1,
                        "lowestPrice": 0.65,
                        "dateAvailable": 1638115200000,
                        "mode": "RELEASE",
                        "mainCategory": {
                            "id": 22275365,
                            "name": "QPSON-Playing Cards",
                            "websiteName": "WhiteLabel"
                        },
                        "subCategories": [
                            {
                                "id": 22234468,
                                "name": "QPSON"
                            }
                        ],
                        "websiteName": "WhiteLabel",
                        "clazz": "com.qpp.cgp.domain.product.ConfigurableProduct",
                        "createdDate": 1747893228819,
                        "internal": false,
                        "isFinished": false
                    },
                    attributeVersion: {},
                    version: 3,
                    defaultDetailSetting: {
                        shortDesc: '1111111111',
                        productDesc: '222222222',
                    },
                    isActived: true,
                    isRelease: true,
                }

            ],*/
            nextItem = queryData.pop(),
            store = Ext.create('Ext.data.Store', {
                fields: [
                    {
                        name: '_id',
                        type: 'number'
                    },
                    {
                        name: 'email', // 操作人
                        type: 'string'
                    },
                    {
                        name: 'createdBy', // 操作人
                        type: 'string'
                    },
                    {
                        name: 'createdDate', // 操作时间
                        type: 'number'
                    },

                    {
                        name: 'product',
                        type: 'object'
                    },
                    {
                        name: 'attributeVersion',
                        type: 'object'
                    },
                    {
                        name: 'version',
                        type: 'number'
                    },
                    {
                        name: 'defaultDetailSetting',
                        type: 'object'
                    },
                    {
                        name: 'isActived',
                        type: 'boolean'
                    },
                    {
                        name: 'isRelease',
                        type: 'boolean'
                    },
                ],
                proxy: {
                    type: 'pagingmemory'
                },
                sorters: [{
                    property: 'version',
                    direction: 'DESC'
                }],
                // data: queryData  //去除最后一个版本
                data: queryData
            });

        if (queryData?.length) {
            Ext.create('Ext.window.Window', {
                layout: 'fit',
                modal: true,
                constrain: true,
                title: i18n.getKey('版本历史'),
                width: 1200,
                height: 400,
                items: [
                    {
                        xtype: 'searchcontainer',
                        name: 'searchcontainer',
                        itemId: 'searchcontainer',
                        filterCfg: {
                            hidden: true,
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
                            pagingBar: false,
                            editAction: false,
                            deleteAction: false,
                            store: store,
                            columnDefaults: {
                                tdCls: 'vertical-middle',
                                align: 'center',
                                renderer: function (value, metadata, record) {
                                    metadata.tdAttr = 'data-qtip ="' + value + '"';
                                    return value
                                }
                            },
                            tbar: {
                                hidden: true,
                                items: [
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
                                ]
                            },
                            selModel: {
                                selType: 'rowmodel',
                                mode: 'SINGLE'
                            },
                            columns: [
                                {
                                    text: i18n.getKey('操作'),
                                    sortable: false,
                                    width: 120,
                                    autoSizeColumn: false,
                                    xtype: 'componentcolumn',
                                    renderer: function (value, metadata, record, row, col, store) {
                                        return {
                                            xtype: 'container',
                                            layout: {
                                                type: 'hbox',
                                                align: 'center',
                                                pack: 'center'
                                            },
                                            defaults: {
                                                margin: '0 5 0 5'
                                            },
                                            items: [
                                                {
                                                    xtype: 'button',
                                                    text: i18n.getKey('查看'),
                                                    handler: function () {
                                                        var isActived = record.get('isActived'),
                                                            isRelease = record.get('isRelease'),
                                                            id = record.get('_id'),
                                                            isHistory = true,
                                                            isReadOnly = true,
                                                            version = record.get('version'),
                                                            product = record.get('product'),
                                                            {type, clazz} = product,
                                                            attributeVersion = record.get('attributeVersion'),
                                                            versionedProductAttributeId = attributeVersion?.id,
                                                            productId = product?.id,
                                                            params = {
                                                                id,
                                                                type,
                                                                clazz,
                                                                version,
                                                                productId,
                                                                isReadOnly,
                                                                isHistory,
                                                                versionedProductAttributeId,
                                                            };

                                                        controller.jumpOpenToEdit(params);
                                                    }
                                                },
                                            ]
                                        }
                                    }
                                },
                                {
                                    text: i18n.getKey('操作人'),
                                    dataIndex: 'email',
                                    width: 180,
                                },
                                {
                                    text: i18n.getKey('操作时间'),
                                    dataIndex: 'createdDate',
                                    width: 180,
                                    renderer: function (value, metadata, record) {
                                        return Ext.Date.format(new Date(+value), 'Y-m-d G:i:s');
                                    }
                                },
                                {
                                    text: i18n.getKey('版本'),
                                    dataIndex: 'version',
                                    width: 120,
                                },
                                {
                                    text: i18n.getKey('发布状态'),
                                    autoSizeColumn: false,
                                    dataIndex: 'isRelease',
                                    width: 200,
                                    renderer: function (value, metadata, record) {
                                        var isActived = record.get('isActived'),
                                            result = [],
                                            valueGather = {
                                                false: [
                                                    {
                                                        color: 'orange',
                                                        text: 'stage'
                                                    },
                                                ],
                                                true: [
                                                    {
                                                        color: 'orange',
                                                        text: 'stage'
                                                    },
                                                    {
                                                        color: 'green',
                                                        text: 'release'
                                                    },
                                                ],
                                            };

                                        valueGather[!!value].forEach(item => {
                                            var {color, text} = item;
                                            result.push(JSCreateFont(color, true, text, 15));
                                        })

                                        return isActived ? `${result.join(', ')} 生效` : '草稿';
                                    }
                                },
                                {
                                    text: i18n.getKey('产品简述'),
                                    dataIndex: 'defaultDetailSetting',
                                    flex: 1,
                                    renderer: function (value, metadata, record) {
                                        var {shortDesc} = value;
                                        metadata.tdAttr = 'data-qtip="' + shortDesc + '"';

                                        return JSAutoWordWrapStr(shortDesc);
                                    }
                                },
                                {
                                    text: i18n.getKey('产品描述'),
                                    dataIndex: 'defaultDetailSetting',
                                    flex: 1,
                                    renderer: function (value, metadata, record) {
                                        var {productDesc} = value;
                                        metadata.tdAttr = 'data-qtip="' + productDesc + '"';

                                        return JSAutoWordWrapStr(productDesc);
                                    }
                                },
                            ]
                        }
                    }
                ],
                bbar: {
                    xtype: 'bottomtoolbar',
                    saveBtnCfg: {
                        hidden: true,
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
        } else {
            Ext.Msg.alert('提示', '暂无历史记录!');
        }
    },

    // 配置
    jumpOpenToEdit: function (params) {
        var {
            id,
            type,
            clazz,
            version,
            productId,
            isHistory,
            isReadOnly,
            upVersionId,
            isUpVersion,
            versionedProductAttributeId,
        } = params;

        JSOpen({
            id: 'websiteproductlist',
            url: path + 'partials/websiteproductlist/edit.html' +
                '?_id=' + id +
                '&type=' + type +
                '&clazz=' + clazz +
                '&version=' + version +
                '&isHistory=' + isHistory +
                '&productId=' + productId +
                '&isReadOnly=' + isReadOnly +
                '&upVersionId=' + upVersionId +
                '&isUpVersion=' + isUpVersion +
                '&versionedProductAttributeId=' + versionedProductAttributeId,
            title: '编辑_产品网店配置',
            refresh: true
        });
    },

    //获取过滤后未选店铺
    getFilterPlatformArr: function (originStoreCodes, needFilterArr) {
        var needFilterCodes = needFilterArr.map(item => {
                return item['platform']
            }),
            result = [];

        originStoreCodes.forEach(item => {
            if (!needFilterCodes.includes(item)) {
                result.push({
                    key: item,
                    value: item,
                })
            }
        })

        return result;
    },

    // 获取店铺数据
    getPlatformData: function (settingId) {
        var controller = this,
            url = adminPath + `api/store-settings/${settingId}/platform-store-settings?page=1&limit=10000`,
            queryData = [];

        if (settingId) {
            queryData = controller.getQuery(url);
        }

        return queryData;
    },

    // 创建编辑店铺个性化配置
    createStoreConfigWin: function (data, defaultConfig, readOnly, settingId, callBack) {
        var controller = this,
            originStoreCodes = ['Manual', 'WooCommerce', 'ManualStore', 'Etsy', 'PopUp', 'Shopify'],
            needFilterArr = controller.getPlatformData(settingId),
            selPlatformData = controller.getFilterPlatformArr(originStoreCodes, needFilterArr),
            isEdit = !!data;

        if (selPlatformData.length || isEdit) {
            var defaultSelPlatformValue = isEdit ? originStoreCodes : selPlatformData[0]['key'];
            Ext.create('Ext.ux.form.field.CreateNextStepWindow', {
                width: 800,
                height: 500,
                pageCount: isEdit ? 1 : 0,
                title: '店铺个性化配置',
                returnValueType: 'object',
                formConfig: {
                    layout: 'fit',
                    defaults: {
                        margin: 0,
                        defaults: {
                            margin: '10 25 5 25',
                            width: 350,
                            allowBlank: false,
                        },
                    },
                },
                pageItemGather: [
                    {
                        xtype: 'errorstrickform',
                        name: 'one',
                        itemId: 'one',
                        layout: { //子项水平垂直居中
                            type: 'vbox',
                            align: 'center',
                            pack: 'center'
                        },
                        items: [
                            {
                                xtype: 'combo',
                                name: 'selPlatform',
                                itemId: 'selPlatform',
                                fieldLabel: '店铺类型',
                                allowBlank: false,
                                displayField: 'key',
                                valueField: 'value',
                                editable: false,
                                value: defaultSelPlatformValue,
                                store: Ext.create('Ext.data.Store', {
                                    fields: [
                                        'key', 'value'
                                    ],
                                    data: selPlatformData
                                }),
                            },
                        ]
                    },
                    {
                        xtype: 'errorstrickform',
                        name: 'two',
                        itemId: 'two',
                        tbar: {
                            disabled: readOnly,
                            items: [
                                {
                                    xtype: 'button',
                                    text: '同步CMS配置',
                                    iconCls: 'icon_export',
                                    handler: function (btn) {
                                        var form = btn.ownerCt.ownerCt,
                                            valueComp = form.getComponent('value');
                                        controller.createImportCMSConfigWin(function (record) {
                                            valueComp.setValue(record.data);
                                        });
                                    }
                                },
                                {
                                    xtype: 'button',
                                    text: '同步默认配置',
                                    iconCls: 'icon_export',
                                    handler: function (btn) {
                                        var form = btn.ownerCt.ownerCt,
                                            valueComp = form.getComponent('value');
                                        Ext.Msg.confirm('提示', '是否确认同步默认配置?', function (selector) {
                                            if (selector === 'yes') {
                                                valueComp.setValue(defaultConfig);
                                            }
                                        });
                                    }
                                }
                            ]
                        },
                        items: [
                            {
                                xtype: 'displayfield',
                                name: 'platform',
                                itemId: 'platform',
                                fieldLabel: '店铺类型',
                                allowBlank: true,
                            },
                            {
                                xtype: 'uxfieldcontainer',
                                width: '100%',
                                margin: '0 0 5 0',
                                defaults: {
                                    margin: '0 0 5 25',
                                },
                                name: 'value',
                                itemId: 'value',
                                layout: 'vbox',
                                items: [
                                    {
                                        xtype: 'diy_html_editor',
                                        fieldLabel: i18n.getKey('产品简述'),
                                        name: 'shortDesc',
                                        itemId: 'shortDesc',
                                        width: '80%',
                                    },
                                    {
                                        xtype: 'diy_html_editor',
                                        fieldLabel: i18n.getKey('产品描述'),
                                        name: 'productDesc',
                                        itemId: 'productDesc',
                                        width: '80%',
                                    }
                                ]
                            },
                        ],
                        listeners: {
                            show: function (comp) {
                                if (!isEdit) {
                                    var container = comp.ownerCt,
                                        one = container.getComponent('one'),
                                        selPlatform = one.getComponent('selPlatform'),
                                        platform = comp.getComponent('platform'),
                                        selPlatformValue = selPlatform.getValue();

                                    platform.setValue(selPlatformValue);
                                }
                            },
                            afterrender: function (comp) {
                                data && comp.setValue(data);
                            }
                        }
                    },
                ],
                bbarConfig: {
                    lastStepBtnCfg: {
                        text: i18n.getKey('上一步'),
                        itemId: 'lastStep',
                        hidden: true,
                        handler: function (btn) {
                            var me = btn.ownerCt.ownerCt;

                            me.pageCount--;
                            me.setPageIndexShow();
                        }
                    },
                    cancelBtnCfg: {
                        text: i18n.getKey('确认'),
                        iconCls: 'icon_save',
                        itemId: 'save',
                        hidden: true,
                        handler: function (btn) {
                            var me = btn.ownerCt.ownerCt,
                                form = me.getComponent('form'),
                                formValue = me.getAllPageValue();

                            if (form.isValid()) {
                                callBack && callBack(formValue['two'])
                                me.close();
                            }
                        }
                    }
                },
                listeners: {
                    afterrender: function (comp) {
                        var toolbar = comp.getDockedItems('toolbar[dock="bottom"]')[0],
                            lastStep = toolbar.getComponent('lastStep'),
                            saveBtn = toolbar.getComponent('save');

                        comp.setPageIndexShow();
                        lastStep.setVisible(false);
                        saveBtn.setDisabled(readOnly);
                    }
                }
            }).show()
        } else {
            Ext.Msg.alert('提示', '已无可配置店铺!');
        }
    },

    // 创建同步CMS配置窗口
    createImportCMSConfigWin: function (callBack) {
        var controller = this,
            productId = JSGetQueryString('productId'),
            store = Ext.create('CGP.cmsconfig.store.CmsConfigStore', {
                pageSize: 10000,
                params: {
                    filter: Ext.JSON.encode([
                        {"name": "product._id", "value": productId, "type": "number"},
                        {"name": "clazz", "value": "com.qpp.cgp.domain.cms.ProductDetailCMSConfig", "type": "string"}
                    ])
                }
            })

        return Ext.create('Ext.window.Window', {
            layout: 'fit',
            modal: true,
            constrain: true,
            title: i18n.getKey('同步CMS配置'),
            width: 1200,
            height: 500,
            items: [
                {
                    xtype: 'searchcontainer',
                    name: 'searchcontainer',
                    itemId: 'searchcontainer',
                    filterCfg: {
                        height: 60,
                        hidden: true,
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
                        pagingBar: false,
                        editAction: false,
                        deleteAction: false,
                        selModel: {
                            selection: "rowmodel",
                            mode: "SINGLE"
                        },
                        store: store,
                        columnDefaults: {
                            tdCls: 'vertical-middle',
                            align: 'center',
                            renderer: function (value, metadata, record) {
                                metadata.tdAttr = 'data-qtip ="' + value + '"';
                                return value
                            }
                        },
                        tbar: {
                            hidden: true,
                            items: []
                        },
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
                                text: i18n.getKey('pageName'),
                                dataIndex: 'pageName',
                                width: 180,
                            },
                            {
                                text: i18n.getKey('pageTile'),
                                dataIndex: 'pageTile',
                                width: 180,
                            },
                            {
                                text: i18n.getKey('产品简述'),
                                dataIndex: 'shortDesc',
                                flex: 1,
                                renderer: function (value, metadata, record) {

                                    return JSAutoWordWrapStr(value);
                                }
                            },
                            {
                                text: i18n.getKey('产品描述'),
                                dataIndex: 'productDesc',
                                flex: 1,
                                renderer: function (value, metadata, record) {

                                    return JSAutoWordWrapStr(value);
                                }
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
                            searchcontainer = win.getComponent('searchcontainer'),
                            selected = searchcontainer.grid.getSelectionModel().getSelection();

                        if (selected?.length) {
                            callBack && callBack(selected[0]);
                            win.close();
                        } else {
                            Ext.Msg.alert('提示', '请至少选择一条数据!')
                        }
                    }
                }
            },
        }).show();
    },

    getUpVersionShortDesc: function (productId, isUpVersion, upVersionId) {
        if (isUpVersion) {
            var controller = this,
                url = adminPath + `api/products/${productId}/store-settings/${upVersionId}`,
                queryData = controller.getQuery(url)

            return queryData?.defaultDetailSetting;
        }
    },

    // 获取网站产品数据
    getWebsiteProductItemData: function (productId, settingId, isUpVersion, upVersionId) {
        var controller = this,
            version = JSGetQueryString('version'),
            upVersionShortDesc = controller.getUpVersionShortDesc(productId, isUpVersion, upVersionId),
            defaultsData = {
                product: {
                    id: productId
                },
                isActived: false,
                isRelease: false,
                version: isUpVersion ? version : 1,
                defaultDetailSetting: isUpVersion ? upVersionShortDesc : {
                    shortDesc: '',
                    productDesc: '',
                }
            };

        if (settingId && (settingId !== 'undefined')) {
            var url = adminPath + `api/products/${productId}/store-settings/${settingId}`,
                queryData = controller.getQuery(url)

            return queryData;
        } else {
            return defaultsData;
        }

        /*queryData = {
            id: 263351647,
            product: {
                "id": 263351647,
                "type": "Configurable",
                "model": "michael_test_impression_i18n_03",
                "name": "michael_test_impression_i18n_03",
                "salePrice": 25.1,
                "lowestPrice": 0.65,
                "dateAvailable": 1638115200000,
                "mode": "RELEASE",
                "mainCategory": {
                    "id": 22275365,
                    "name": "QPSON-Playing Cards",
                    "websiteName": "WhiteLabel"
                },
                "subCategories": [
                    {
                        "id": 22234468,
                        "name": "QPSON"
                    }
                ],
                "websiteName": "WhiteLabel",
                "clazz": "com.qpp.cgp.domain.product.ConfigurableProduct",
                "createdDate": 1747893228819,
                "internal": false,
                "isFinished": false
            },
            attributeVersion: {},
            version: 1,
            defaultDetailSetting: {
                shortDesc: '1111111111',
                productDesc: '222222222',
            },
            isActived: true,
            isRelease: true,
        };*/
    },

    // 删除店铺配置数据
    deleteStoreConfigDataHandler: function (settingId, id, callBack) {
        var controller = this,
            url = adminPath + `api/store-settings/${settingId}/platform-store-settings/${id}`;

        Ext.Msg.confirm('提示', '确定删除？', function (selector) {
            if (selector === 'yes') {
                controller.deleteQuery(url, callBack);
            }
        });
    },

    // 更新店铺配置数据
    upDataStoreConfigDataHandler: function (settingId, id, postData, callBack) {
        var controller = this,
            isEdit = !!id,
            serverAim = `api/store-settings/${settingId}/platform-store-settings`,
            suffix = isEdit ? `/${id}` : '',
            url = adminPath + `${serverAim}${suffix}`;

        postData['clazz'] = 'com.qpp.cgp.domain.product.config.PlatformStoreProductDetailSetting';
        postData['storeProductSetting'] = {
            _id: settingId,
            clazz: 'com.qpp.cgp.domain.product.config.ProductDefaultSettingForStore'
        };
        controller.asyncEditQuery(url, postData, isEdit, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    const data = responseText.data;
                    callBack && callBack(data);
                }
            }
        })
    },

    // 保存默认配置数据
    upDataDefaultConfigDataHandler: function (productId, settingId, postData, callBack) {
        var controller = this,
            versionedProductAttributeId = JSGetQueryString('versionedProductAttributeId'),
            // isEdit = !!settingId,
            isEdit = settingId && settingId !== 'undefined',
            serverAim = `api/products/${productId}/store-settings`,
            suffix = isEdit ? `/${settingId}` : '',
            msg = isEdit ? `修改成功!` : '保存成功!',
            url = adminPath + `${serverAim}${suffix}`;

        if (versionedProductAttributeId && versionedProductAttributeId !== 'undefined') {
            postData['attributeVersion'] = {
                _id: +versionedProductAttributeId,
                clazz: 'com.qpp.cgp.domain.product.attribute.VersionedProductAttribute'
            }
        }

        controller.asyncEditQuery(url, postData, isEdit, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    const data = responseText.data;
                    Ext.Msg.alert('提示', msg, function () {
                        callBack && callBack(data);
                    });
                }
            }
        })
    },

    // 获取店铺图标
    getPlatFormIcon: function (platformCode) {
        var iconGather = {
                Manual: 'a22db0910569f73d2de20adba0e73983.svg',
                WooCommerce: 'a38b15d5c8119e762bb95842d1323ee7.svg',
                ManualStore: '6fa937859bf8adb91b9094e82879607b.svg',
                Etsy: '9794075a5cc9e233063eac1e1430a6fc.svg',
                PopUp: 'e6e9bfd3ff443abe64903b0cccf78726.svg',
                Shopify: '8c6d2e785339a2a41d827a1873cbf02b.svg',
            },
            imageSuffixUrl = iconGather[platformCode];

        return imageServer + imageSuffixUrl + '/17/17';
    },

    getVersionDataIsShow: function (productId) {
        var controller = this,
            url = adminPath + 'api/store-settings/versionAttribute-view?page=1&limit=10000&filter=' + Ext.JSON.encode([
                {
                    name: "product._id",
                    value: productId,
                    type: "number"
                },
                {
                    name: 'status',
                    value: 'DRAFT',
                    type: 'string',
                    operator: 'ne',
                },
            ]),
            queryData = controller.getQuery(url);

        return !!queryData?.length
    },

    // 获取店铺数据 做升级版本
    getStoreConfigData: function (settingId, productId) {
        var controller = this,
            url = adminPath + `api/store-settings/${settingId}/platform-store-settings?page=1&limit=10000`,
            queryData = controller.getQuery(url);

        queryData.forEach(item=>{
            delete item._id;
            delete item.createdBy;
            delete item.createdDate;
            delete item.modifiedDate;
        })

        return queryData
    },
})