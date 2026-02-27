/**
 * @Description:发布操作的日志，记录所以发布操作信息
 * @author nan
 * @date 2022/4/28
 */
Ext.Loader.syncRequire([
    'CGP.cmslog.config.Config',
    'CGP.cmslog.view.DetailGrid',
    'CGP.common.field.ProductGridCombo'
]);
Ext.onReady(function () {
    var CMSLogStore = Ext.create('CGP.cmslog.store.CMSPublishRecordStore', {
        autoLoad: true,
    });
    //正式环境不给发布，只能发布stage环境然后通过切换服务器来进行更换
    var isProduction = (JSWebsiteIsStage() && (JSWebsiteIsTest() == false));
    var controller = Ext.create('CGP.cmslog.controller.Controller');
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('CMSPublishRecord'),
        block: 'cmslog',
        editPage: 'edit.html',
        tbarCfg: {
            btnCreate: {
                width: 100,
                iconCls: 'computer_go',
                text: '发布产品页',
                disabled: isProduction,
                handler: function (btn) {
                    JSOpen({
                        id: 'publishProduct',
                        url: path + 'partials/cmslog/publishproduct.html',
                        title: i18n.getKey('publish') + i18n.getKey('product'),
                        refresh: true
                    })
                }
            },
            btnDelete: {
                width: 100,
                iconCls: 'computer_go',
                text: '发布类目页',
                disabled: isProduction,
                handler: function (btn) {
                    JSOpen({
                        id: 'publishCategory',
                        url: path + 'partials/cmslog/publishcategory.html',
                        title: i18n.getKey('publish') + i18n.getKey('catalog'),
                        refresh: true
                    })
                }
            },
            btnExport: {
                width: 100,
                iconCls: 'computer_go',
                text: '发布普通页',
                disabled: isProduction,
                handler: function (btn) {
                    JSOpen({
                        id: 'publishNormalPage',
                        url: path + 'partials/cmslog/publishnormalpage.html',
                        title: i18n.getKey('publish') + i18n.getKey('catalog'),
                        refresh: true
                    })
                }
            },
            btnHelp: {
                qtip: '配置说明',
                text: i18n.getKey('发布流程图'),
                width: 100,
                handler: function (display) {
                    JSOpen({
                        id: 'configHelp',
                        url: imageServer + '3be5f02c6b0e1cdbf049ea544c5be20b.png',
                        title: '发布流程',
                        refresh: true
                    })
                }
            }
        },
        gridCfg: {
            store: CMSLogStore,
            frame: false,
            deleteAction: false,
            customPaging: [
                {value: 25},
                {value: 50},
                {value: 75},
                {value: 100}
            ],
            editActionConfig: {
                iconCls: 'icon_check icon_margin',
                tooltip: '查看详情',
                handler: function (view, rowIndex, colIndex, object, event, record, dom) {
                    JSOpen({
                        id: 'CMSLog_detail',
                        url: path + 'partials/cmslog/edit.html?id=' + record.get(record.idProperty),
                        title: i18n.getKey('CMSLog') + '(' + record.get(record.idProperty) + ')',
                        refresh: true
                    });
                }
            },
            columnDefaults: {
                tdCls: 'vertical-middle',
                autoSizeColumn: true
            },
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: '_id',
                },
                {
                    text: i18n.getKey('status'),
                    dataIndex: 'status',
                    width: 300,
                    xtype: 'componentcolumn',
                    renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                        var str = CGP.cmslog.config.Config.statusMap[value];
                        var errorInfo = record.get('message');
                        if (!(isProduction)) {
                            if (Ext.Array.contains([0, 3, 5, 7], value)) {
                                str += '    <a href="#" itemId="retry" style="color: blue;text-decoration: none">' + i18n.getKey('retry') + '</a>';

                            } else if (value == 200) {
                                str += '    <a href="#" itemId="retry" style="color: blue;text-decoration: none">' + i18n.getKey('重新发布') + '</a>';
                            }
                        }
                        if (errorInfo) {
                            str += '&nbsp;&nbsp;&nbsp; <a href="#" itemId="showDetail" style="color: blue;text-decoration: none">' + i18n.getKey('check') + i18n.getKey('errorDetail') + '</a>'
                        }

                        return {
                            xtype: 'displayfield',
                            value: str,
                            listeners: {
                                render: function (display) {
                                    var arr = display.el.dom.getElementsByTagName('a'); //获取到该html元素下的a元素
                                    for (var i = 0; i < arr.length; i++) {
                                        var item = arr[i];
                                        var itemId = item.getAttribute('itemId');
                                        if (itemId == 'retry') {
                                            var ela = Ext.fly(item); //获取到a元素的element封装对象
                                            ela.on("click", function () {
                                                var controller = Ext.create('CGP.cmslog.controller.Controller');
                                                var data = controller.buildPublishData(record);
                                                Ext.Msg.confirm(i18n.getKey('prompt'), '是否确认重新发布?', function (selector) {
                                                    if (selector == 'yes') {
                                                        controller.publish(data);
                                                    }
                                                });
                                            });
                                        } else if (itemId == 'showDetail') {
                                            var ela = Ext.fly(item); //获取到a元素的element封装对象
                                            ela.on("click", function () {
                                                JSShowJsonData(errorInfo, i18n.getKey('错误信息'));
                                            });
                                        }
                                    }
                                }
                            }
                        };
                    }
                },
                {
                    text: i18n.getKey('productMode'),
                    dataIndex: 'statusOfProduct',
                    xtype: 'uxarraycolumnv2',
                    width: 100,
                    renderer: function (value) {
                        var map = {
                            TEST: '测试',
                            RELEASE: '正式'
                        }
                        return map[value];
                    }
                },
                //目标环境QPSON,QPMN
                {
                    text: i18n.getKey('发布目标'),
                    dataIndex: 'extraParams',
                    width: 200,
                    renderer: function (value, metaData, record) {
                        var targetEnvStatus = record.get('targetEnvStatus');
                        var cmsPublishRequestSnapShot = record.get('cmsPublishRequestSnapShot');
                        var configTag = cmsPublishRequestSnapShot.extraParams.websiteConfig.configTag;
                        var items = [{
                            title: '目标环境',
                            value: controller.judgeTargetEnv(record.getData())
                        }, {
                            title: '状态',
                            value: `<font color="${targetEnvStatus == 'Stage' ? 'green' : 'red'}">${targetEnvStatus}</font>`
                        }];
                        if (configTag) {
                            items.push({
                                title: '配置标识',
                                value: `${configTag}`
                            });
                        }
                        return JSCreateHTMLTable(items);
                    }
                },
                {
                    text: i18n.getKey('publish') + i18n.getKey('type'),
                    dataIndex: 'publishType',
                    width: 100,
                    xtype: 'uxarraycolumnv2',
                    renderer: function (value) {
                        var map = {
                            ProductDetail: '产品详情页',
                            ProductCategory: '产品分类页',
                            Normal: '普通页'
                        };
                        return map[value];
                    }
                },
                {
                    text: i18n.getKey('发布时间'),
                    dataIndex: 'createdDate',
                    width: 200,
                    renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                        metaData.style = "color: gray";
                        value = Ext.Date.format(new Date(value), 'Y/m/d H:i');
                        metaData.tdAttr = 'data-qtip="' + value + '"';
                        return '<div style="white-space:normal;">' + value + '</div>';
                    }
                },
                {
                    xtype: 'atagcolumn',
                    text: i18n.getKey('发布人'),
                    dataIndex: 'createdUser',
                    width: 200,
                    flex: 1,
                    getDisplayName: function (value, metadata, record) {
                        return value.emailAddress + '(<a href="#" style="color: blue;text-decoration: none">' + value.id + '</a>)';

                    },
                    clickHandler: function (value, metadata, record, rowIndex, colIndex, store, view) {
                        JSOpen({
                            id: 'customerpage',
                            url: path + "partials/customer/customer.html?id=" + value.id,
                            title: i18n.getKey('customer'),
                            refresh: true
                        })
                    },
                },
            ]
        },
        filterCfg: {
            items: [
                {
                    name: '_id',
                    itemId: '_id',
                    xtype: 'textfield',
                    isLike: false,
                    fieldLabel: i18n.getKey('id'),
                },
                {
                    name: 'status',
                    xtype: 'combo',
                    fieldLabel: i18n.getKey('status'),
                    itemId: 'status',
                    editable: false,
                    haveReset: true,
                    valueField: 'value',
                    displayField: 'display',
                    store: {
                        xtype: 'store',
                        fields: ['value', 'display'],
                        data: CGP.cmslog.config.Config.statusArr
                    }
                },
                {
                    xtype: 'combo',
                    fieldLabel: i18n.getKey('发布目标环境状态'),
                    itemId: 'targetEnvStatus',
                    name: 'targetEnvStatus',
                    valueField: 'value',
                    displayField: 'display',
                    editable: false,
                    store: {
                        xtype: 'store',
                        fields: ['value', 'display'],
                        data: [{
                            value: 'TEST',
                            display: 'STAGE'
                        }, {
                            value: 'RELEASE',
                            display: 'RELEASE'
                        }]
                    },
                },
                {
                    name: 'statusOfProduct',
                    xtype: 'combo',
                    fieldLabel: i18n.getKey('productMode'),
                    itemId: 'statusOfProduct',
                    editable: false,
                    haveReset: true,
                    valueField: 'value',
                    displayField: 'display',
                    store: {
                        xtype: 'store',
                        fields: ['value', 'display'],
                        data: [
                            {
                                value: 'TEST',
                                display: '测试'
                            },
                            {
                                value: 'RELEASE',
                                display: '正式'
                            }
                        ]
                    }
                },
                {
                    name: 'publishType',
                    xtype: 'combo',
                    fieldLabel: i18n.getKey('publish') + i18n.getKey('type'),
                    itemId: 'publishType',
                    editable: false,
                    haveReset: true,
                    valueField: 'value',
                    displayField: 'display',
                    store: {
                        xtype: 'store',
                        fields: ['value', 'display'],
                        data: [
                            {
                                value: 'ProductDetail',
                                display: i18n.getKey('ProductDetail')
                            },
                            {
                                value: 'ProductCategory',
                                display: i18n.getKey('ProductCategory')
                            },
                            {
                                value: 'Normal',
                                display: i18n.getKey('普通页')
                            }
                        ]
                    }
                },
                {
                    xtype: 'productgridcombo',
                    name: 'productId',
                    itemId: 'productId',
                    fieldLabel: i18n.getKey('产品'),
                    gotoConfigHandler: null,
                }
            ]
        },
    });
});

