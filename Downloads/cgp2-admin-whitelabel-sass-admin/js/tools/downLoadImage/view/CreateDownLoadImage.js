/**
 * @author xiu
 * @date 2024/7/29
 */
Ext.Loader.syncRequire([
    'Ext.ux.form.field.CreateLoadingComp',
    'CGP.tools.downLoadImage.store.DownLoadImageStore'
])
Ext.define('CGP.tools.downLoadImage.view.CreateDownLoadImage', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.down_load_image',
    layout: 'fit',
    initComponent: function () {
        var me = this,
            controller = Ext.create('CGP.tools.downLoadImage.controller.Controller'),
            orderStore = Ext.create('CGP.orderv2.store.OrderListStore'),
            store = Ext.create('CGP.tools.downLoadImage.store.DownLoadImageStore');

        me.tbar = [
            {
                xtype: 'button',
                text: i18n.getKey('refresh'),
                iconCls: 'icon_refresh',
                handler: function (btn) {
                    location.reload();
                }
            }
        ]

        me.items = [
            {
                xtype: 'errorstrickform',
                itemId: 'form',
                defaults: {
                    margin: '10 25 5 25',
                    width: 350,
                    allowBlank: false,
                },
                items: [
                    {
                        xtype: 'combo',
                        name: 'selectInputType',
                        itemId: 'selectInputType',
                        fieldLabel: i18n.getKey('导入方式'),
                        editable: false,
                        allowBlank: false,
                        displayField: 'key',
                        valueField: 'value',
                        value: 'orderItemInput',
                        store: Ext.create('Ext.data.Store', {
                            fields: [
                                'key', 'value'
                            ],
                            data: [
                                {
                                    key: '订单项导入',
                                    value: 'orderItemInput',
                                },
                                {
                                    key: '图片路径导入',
                                    value: 'imageArrInput',
                                },
                            ]
                        }),
                        listeners: {
                            change: function (comp, newValue) {
                                var form = comp.ownerCt,
                                    downLoadEnvironment = form.getComponent('downLoadEnvironment'),
                                    container = form.getComponent('container'),
                                    orderId = form.getComponent('orderId'),
                                    orderLineItemId = form.getComponent('orderLineItemId'),
                                    typeArr = ['orderItemInput', 'imageArrInput'],
                                    typeGather = {
                                        orderItemInput: [orderId, orderLineItemId],
                                        imageArrInput: [container, downLoadEnvironment]
                                    },
                                    selectComps = typeGather[newValue],
                                    selectIndex = typeArr.findIndex(item => item === newValue),
                                    onSelectItems = typeArr.splice(selectIndex - 1, 1),
                                    onSelectComps = [];

                                onSelectItems.forEach(item => {
                                    var itemCompArr = typeGather[item];

                                    onSelectComps = Ext.Array.merge(onSelectComps, itemCompArr);
                                })

                                selectComps.forEach(item => {
                                    item.setDisabled(false);
                                    item.setVisible(true);
                                })

                                onSelectComps.forEach(item => {
                                    item.setDisabled(true);
                                    item.setVisible(false);
                                })
                            }
                        }
                    },
                    {
                        xtype: 'gridcombo',
                        name: 'orderId',
                        itemId: 'orderId',
                        editable: false,
                        autoScroll: true,
                        allowBlank: false,
                        multiSelect: false,
                        matchFieldWidth: false,
                        fieldLabel: i18n.getKey('选择订单'),
                        displayField: 'orderNumber',
                        valueField: 'id',
                        store: orderStore,
                        diyGetValue: function () {
                            const me = this,
                                result = [];

                            Object.values(me.getValue()).forEach(item => {
                                result.push(item['id'])
                            })
                            return result
                        },
                        filterCfg: {
                            layout: {
                                type: 'column'
                            },
                            defaults: {
                                margin: '5 0 5 0',
                                isLike: false,
                            },
                            items: [
                                /* {
                                     name: '_id',
                                     itemId: 'id',
                                     isLike: false,
                                     hideTrigger: true,
                                     fieldLabel: i18n.getKey('id'),
                                     xtype: 'textfield',
                                     hidden: JSWebsiteIsStage()
                                 },*/
                                {
                                    name: 'orderNumber',
                                    enforceMaxLength: true,
                                    xtype: 'textfield',
                                    listeners: {
                                        render: function (comp) {
                                            var orderNumber = JSGetQueryString('orderNumber');
                                            if (orderNumber) {
                                                comp.setValue(orderNumber);
                                            }
                                        }
                                    },
                                    fieldLabel: i18n.getKey('orderNumber'),
                                    itemId: 'orderNumber',
                                    width: 360
                                },
                                {
                                    fieldLabel: i18n.getKey('orderStatus'),
                                    id: 'statusSearch',
                                    name: 'statusId',
                                    itemId: 'orderStatus',
                                    xtype: 'combo',
                                    editable: false,
                                    store: Ext.create('CGP.common.store.OrderStatuses', {
                                        autoLoad: false
                                    }),
                                    displayField: 'name',
                                    valueField: 'id',
                                    titleField: 'tipInfo',
                                    listeners: {
                                        afterrender: function (combo) {
                                            var store = combo.getStore();
                                            store.on('load', function () {
                                                if (!combo.getValue())
                                                    combo.select(store.getAt(0));
                                            });
                                        }
                                    }
                                },
                                {
                                    name: 'isTest',
                                    xtype: 'combobox',
                                    editable: false,
                                    haveReset: true,
                                    fieldLabel: i18n.getKey('isTest'),
                                    itemId: 'isTest',
                                    store: new Ext.data.Store({
                                        fields: ['name', {
                                            name: 'value',
                                            type: 'boolean'
                                        }],
                                        data: [
                                            {
                                                value: true,
                                                name: i18n.getKey('true')
                                            },
                                            {
                                                value: false,
                                                name: i18n.getKey('false')
                                            },
                                        ]
                                    }),
                                    displayField: 'name',
                                    value: JSWebsiteIsTest() || !JSWebsiteIsStage(),
                                    valueField: 'value',
                                },
                                {
                                    name: 'websiteId',
                                    itemId: 'website',
                                    id: 'websiteSearch',
                                    xtype: 'websitecombo',
                                    hidden: true,
                                },
                            ]
                        },
                        gridCfg: {
                            store: orderStore,
                            height: 400,
                            width: 1100,
                            autoScroll: true,
                            columns: [
                                {
                                    xtype: 'rownumberer',
                                    tdCls: 'vertical-middle',
                                    width: 60
                                },
                                /*  {
                                      text: i18n.getKey('id'),
                                      dataIndex: 'id',
                                      hidden: !JSWebsiteIsTest(),
                                      itemId: 'id',
                                      width: 100
                                  },*/
                                {
                                    xtype: 'atagcolumn',
                                    text: i18n.getKey('orderNumber'),
                                    dataIndex: 'orderNumber',
                                    autoSizeColumn: false,
                                    width: 180,
                                    getDisplayName: function (value, metadata, record) {
                                        var isTest = record.get('isTest') ? `<${JSCreateFont('#ff0000', false, "测试")}>` : '';
                                        var isRedo = record.get('isRedo');
                                        var statusId = record.get('statusId')
                                        var isPause = record.get('isPause');
                                        var uploadedCountSum = record.get('uploadedCountSum');
                                        var waitUploadCount = record.get('waitUploadCount');
                                        var template = '<a style="text-decoration: none;" href="#">' + value + '</a>' + isTest;
                                        metadata.tdAttr = 'data-qtip=跳转至订单详情';
                                        if (isPause) {
                                            template += '<' + '<font color=red>' + i18n.getKey('pause') + '</font>' + '>';
                                        }
                                        if (isRedo && statusId != 240710 && (Ext.Array.contains([103, 104, 105, 106, 107], statusId) || record.get('orderType') == 'RD')) {
                                            template += '<' + '<text style="color: red">' + i18n.getKey('redo') + i18n.getKey('order') + '</text>' + '>';
                                        }
                                        if (uploadedCountSum != 0 && waitUploadCount != 0) {
                                            template += '<' + '<text style="color: red">' + '待上传文档订单项：' + waitUploadCount + '</text>' + '>';
                                        }
                                        return template;
                                    },
                                    clickHandler: function (value, metadata, record) {
                                        var statusId = record.get('statusId');
                                        window.showOrderDetail(record.get('id'), value, statusId);
                                    }
                                },
                                {
                                    text: i18n.getKey('订单标识'),
                                    dataIndex: 'suspectedSanction',
                                    width: 100,
                                    renderer: function (value, metadata, record, row, col, store) {
                                        return value ? (JSCreateFont('red', true, '!', 25) + ' ' +
                                            JSCreateFont('red', true, ' 疑似制裁')) : ''
                                    }
                                },
                                //订单类型
                                {
                                    text: i18n.getKey('orderType'),
                                    dataIndex: 'type',
                                    itemId: 'orderType',
                                    width: 100,
                                    renderer: function (value, metadata) {
                                        var valueMapping = {
                                            'NORMAL': '普通订单',
                                            'PARTNER_SAMPLE': 'SAMPLE订单',
                                            'ONE_DRAGON': '一条龙订单',
                                            'PROOFING': '打样订单'
                                        };

                                        metadata.style = 'color:red';
                                        return valueMapping[value];
                                    }
                                },
                                {
                                    text: i18n.getKey('sourcePlatform'),
                                    dataIndex: 'sourcePlatform',
                                    width: 100,
                                    renderer: function (value, metadata, record, row, col, store) {
                                        if (value) {

                                        } else {
                                            value = '其它';
                                        }
                                        return value;
                                    }
                                },
                                //订单状态
                                {
                                    xtype: 'atagcolumn',
                                    text: i18n.getKey('status'),
                                    dataIndex: 'statusId',
                                    sortable: false,
                                    width: 160,
                                    getDisplayName: function (value, metadata, record) {
                                        metadata.style = 'color:red';
                                        var statusId = record.get('statusId');
                                        var statusName = record.get('statusName');
                                        var resultName = '<font color="red">' + i18n.getKey(statusName) + '</font>';

                                        if (record.get('isRedo')) {
                                            if (statusId == 103) {
                                                resultName = i18n.getKey('redo-confirmed(waitting print)');
                                            } else {
                                                if (statusId != 240710 && Ext.Array.contains([104, 105, 106, 107], Number(statusId))) {
                                                    resultName = i18n.getKey('redo') + '-' + i18n.getKey(statusName);
                                                }
                                            }
                                        }
                                        return resultName;
                                    }
                                },
                                //订单项数
                                {
                                    sortable: true,
                                    text: i18n.getKey('totalCount'),
                                    dataIndex: 'totalCount',
                                    itemId: 'totalCount',
                                    xtype: 'numbercolumn',
                                    format: '0,000',
                                    width: 65,
                                    renderer: function (value, metadata, record) {
                                        metadata.style = 'color:blue';
                                        return value;
                                    }
                                },
                                // 排版状态
                                {
                                    xtype: 'atagcolumn',
                                    text: i18n.getKey('排版状态'),
                                    dataIndex: 'paibanStatus',
                                    itemId: 'paibanStatus',
                                    sortable: false,
                                    flex: 1,
                                    getDisplayName: function (value, metadata, record) {
                                        metadata.style = 'color:red';
                                        var statusNameGather = {
                                                4: {
                                                    color: 'green',
                                                    text: i18n.getKey('排版成功'),
                                                    extraText: ' <a href="#">' + i18n.getKey('排版进度') + '</a>'
                                                },
                                                3: {
                                                    color: 'red',
                                                    text: i18n.getKey('排版失败'),
                                                    extraText: ' <a href="#">' + i18n.getKey('排版进度') + '</a>'
                                                },
                                                2: {
                                                    color: 'blue',
                                                    text: i18n.getKey('正在排版'),
                                                    extraText: ' <a href="#">' + i18n.getKey('排版进度') + '</a>'
                                                },
                                                1: {
                                                    color: 'grey',
                                                    text: i18n.getKey('等待排版'),
                                                    extraText: ' <a href="#">' + i18n.getKey('排版进度') + '</a>'
                                                },
                                            },
                                            {color, text, extraText} = statusNameGather[value],
                                            statusName = JSCreateFont(color, true, text),
                                            resultName = statusName + extraText;

                                        return resultName;
                                    },
                                    clickHandler: function (value, metadata, record) {
                                        var id = record.get('id'),
                                            orderNumber = record.get('orderNumber'),
                                            statusId = value.id,
                                            store = Ext.create('CGP.common.typesettingschedule.store.LastTypesettingScheduleStore', {
                                                params: {
                                                    filter: '[{"name":"orderNumber","value":"' + orderNumber + '","type":"string"}]',
                                                }
                                            });

                                        Ext.create('CGP.common.typesettingschedule.TypeSettingGrid', {
                                            record: record,
                                            orderId: id,
                                            gridStore: store,
                                            statusId: statusId,
                                            orderNumber: orderNumber,
                                        }).show();
                                    }
                                },
                            ],
                            bbar: {
                                xtype: 'pagingtoolbar',
                                store: orderStore,
                                displayInfo: true, // 是否 ? 示， 分 ? 信息
                                displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
                                emptyMsg: i18n.getKey('noData')
                            }
                        },
                        listeners: {
                            afterrender: function (comp) {
                                // comp.setInitialKeyValues('_id', ['252348083']);//70
                                /* comp.setInitialKeyValues('_id', [
                                     '149425940',
                                     // '151529628'
                                 ]);//release*/
                                // comp.setInitialKeyValues('_id', ['176912140']);//release
                            },
                            change: function (comp, newValue) {
                                var form = comp.ownerCt,
                                    orderId = comp.diyGetValue()[0],
                                    orderLineItemId = form.getComponent('orderLineItemId');

                                if (orderId) {
                                    var orderLineItemIdStore = Ext.create('CGP.orderlineitemv2.store.OrderLineItemByOrderStore', {
                                            orderId: orderId
                                        }),
                                        downLoadImage = form.getComponent('downLoadImage'),
                                        downLoadImageWinStore = downLoadImage.winStore;

                                    orderLineItemId && form.remove(orderLineItemId);

                                    form.insert(2, {
                                        xtype: 'gridcombo',
                                        name: 'orderLineItemId',
                                        itemId: 'orderLineItemId',
                                        editable: false,
                                        allowBlank: false,
                                        multiSelect: false,
                                        matchFieldWidth: false,
                                        fieldLabel: i18n.getKey('选择订单项'),
                                        displayField: '_id',
                                        valueField: '_id',
                                        store: orderLineItemIdStore,
                                        diyGetValue: function () {
                                            const me = this,
                                                result = [];

                                            Object.values(me.getValue()).forEach(item => {
                                                result.push(item['_id'])
                                            })
                                            return result
                                        },
                                        getProductInstanceId: function () {
                                            const me = this,
                                                result = [];

                                            Object.values(me.getValue()).forEach(item => {
                                                result.push(item['productInstanceId'])
                                            })

                                            return result
                                        },
                                        filterCfg: {
                                            layout: {
                                                type: 'column'
                                            },
                                            defaults: {
                                                margin: '5 0 5 0',
                                                isLike: false,
                                            },
                                            items: [
                                                {
                                                    xtype: 'textfield',
                                                    name: '_id',
                                                    itemId: 'id',
                                                    isLike: false,
                                                    hideTrigger: true,
                                                    fieldLabel: i18n.getKey('id'),
                                                },
                                            ]
                                        },
                                        gridCfg: {
                                            store: orderLineItemIdStore,
                                            height: 450,
                                            autoScroll: true,
                                            width: 1100,
                                            columns: [
                                                {
                                                    text: i18n.getKey('订单项序号'),
                                                    dataIndex: 'seqNo',
                                                    width: 110,
                                                },
                                                {
                                                    text: i18n.getKey('id'),
                                                    width: 120,
                                                    dataIndex: '_id',
                                                },
                                                {
                                                    xtype: 'imagecolumn',
                                                    dataIndex: '_id',
                                                    text: i18n.getKey('image'),
                                                    width: 140,
                                                    //订单的缩略图特殊位置
                                                    buildUrl: function (value, metadata, record) {
                                                        var thumbnailInfo = record.get('thumbnailInfo');
                                                        var status = thumbnailInfo?.status;
                                                        var thumbnail = thumbnailInfo?.thumbnail;
                                                        if (['', undefined].includes(thumbnail) && !['FAILURE', 'RUNNING'].includes(status)) {
                                                            status = 'NULL'
                                                        }
                                                        var statusGather = {
                                                            SUCCESS: function () {
                                                                return '查看图片';
                                                            },
                                                            FAILURE: function () {
                                                                return '图片生成失败';
                                                            },
                                                            RUNNING: function () {
                                                                return '图片正在生成中';
                                                            },
                                                            INIT: function () {
                                                                return '查看图片';
                                                            },
                                                            NULL: function () {
                                                                return '图片为空';
                                                            }
                                                        }
                                                        metadata.tdAttr = `data-qtip=${statusGather[status]()}`
                                                        return projectThumbServer + thumbnail;
                                                    },
                                                    //订单的缩略图特殊位置
                                                    buildPreUrl: function (value, metadata, record) {
                                                        var thumbnailInfo = record.get('thumbnailInfo');
                                                        var thumbnail = thumbnailInfo?.thumbnail;
                                                        return projectThumbServer + thumbnail;
                                                    },
                                                    buildTitle: function (value, metadata, record) {
                                                        var productName = record.get('productName');
                                                        return `${i18n.getKey('check')} < ${productName} > 预览图`;
                                                    }
                                                },
                                                {
                                                    dataIndex: 'productName',
                                                    text: i18n.getKey('product') + '|' + i18n.getKey('material'),
                                                    width: 300,
                                                    renderer: function (value, metadata, record) {
                                                        return value;
                                                    }
                                                },
                                                {
                                                    xtype: 'atagcolumn',
                                                    dataIndex: 'productName',
                                                    text: i18n.getKey('product') + i18n.getKey('description'),
                                                    flex: 1,
                                                    getDisplayName: function (value, metadata, record) {
                                                        var productDescription = record.get('productDescription');

                                                        return JSAutoWordWrapStr(JSCreateFont('#000000', true, productDescription || value)) +
                                                            '\n<a href="#" data-qtip="产品属性" style="color: blue; font-weight: bold">查看产品属性</a>'
                                                    },
                                                    clickHandler: function (value, metadata, record) {
                                                        var orderItemId = record.get('_id');
                                                        var url = adminPath + `api/orderItems/${orderItemId}/productAttributeValues`;
                                                        JSAjaxRequest(url, 'GET', true, null, false, function (require, success, response) {
                                                            if (success) {
                                                                var responseText = Ext.JSON.decode(response.responseText);
                                                                if (responseText.success) {
                                                                    var data = responseText.data;
                                                                    var store = Ext.create('Ext.data.Store', {
                                                                        fields: ['attributeName', 'attributeValue'],
                                                                        data: data
                                                                    });
                                                                    var win = Ext.create('Ext.window.Window', {
                                                                        title: i18n.getKey('查看产品属性'),
                                                                        modal: true,
                                                                        constrain: true,
                                                                        maxHeight: 550,
                                                                        minHeight: 250,
                                                                        width: 400,
                                                                        layout: 'fit',
                                                                        items: [{
                                                                            xtype: 'grid',
                                                                            header: false,
                                                                            store: store,
                                                                            columns: [
                                                                                {
                                                                                    xtype: 'rownumberer'
                                                                                },
                                                                                {
                                                                                    xtype: "auto_bread_word_column",

                                                                                    text: i18n.getKey('属性名'),
                                                                                    dataIndex: 'attributeName',
                                                                                    flex: 1
                                                                                },
                                                                                {
                                                                                    xtype: "auto_bread_word_column",
                                                                                    dataIndex: 'attributeValue',
                                                                                    text: i18n.getKey('值'),
                                                                                    flex: 2
                                                                                }
                                                                            ]
                                                                        }]
                                                                    });
                                                                    win.show(null, function () {
                                                                        var win = this;
                                                                        setTimeout(function () {
                                                                            win.center();
                                                                        }, 100);
                                                                    });
                                                                }
                                                            }
                                                        }, true);
                                                    },
                                                },
                                            ],
                                            bbar: Ext.create('Ext.PagingToolbar', {
                                                store: orderLineItemIdStore,
                                                displayInfo: true, // 是否 ? 示， 分 ? 信息
                                                displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
                                                emptyMsg: i18n.getKey('noData')
                                            })
                                        },
                                        listeners: {
                                            afterrender: function (comp) {
                                                // comp.setInitialKeyValues('id', ['252348082']); //70
                                                // comp.setInitialKeyValues('id', ['176912694']); //release

                                                /* comp.setInitialKeyValues('id', [
                                                     '149425939',
                                                     // '151529627'
                                                 ]); //release*/
                                            },
                                            change: function (comp, newValue) {
                                                var productInstanceIds = comp.getProductInstanceId(),
                                                    result = [];

                                                if (productInstanceIds.length) {
                                                    // 老方法 并不能获取到已使用的图片 会存在大量未使用的上传图片导致很难找到pc的使用图
                                                    /*productInstanceIds.forEach(itemId => {
                                                        var url = adminPath + `api/bom/productInstances/${itemId}?includeReferenceEntity=true&includeMaterialReferenceEntity=true`,
                                                            getData = JSGetQuery(url),
                                                            {_id} = getData,
                                                            imageRelations = getData?.builderCache?.runtime?.imageRelations;

                                                        if (imageRelations) {
                                                            imageRelations.map(item => {
                                                                var {useCount} = item; //图片被使用次数记录

                                                                // 被使用的才能看见
                                                                if (useCount) {
                                                                    // 打上分组标签
                                                                    result.push(Ext.Object.merge(item, {
                                                                        productInstanceId: _id
                                                                    }));
                                                                }
                                                            })
                                                        }
                                                    })*/

                                                    productInstanceIds.forEach(productInstanceId => {
                                                        var sbomNodeRuntimeId = controller.getProductInstanceEnLatestV3(productInstanceId),
                                                            itemResult = controller.getPageContentImageRelation(sbomNodeRuntimeId)

                                                        itemResult.forEach(item => {
                                                            result.push(Ext.Object.merge(item, {
                                                                productInstanceId: productInstanceId
                                                            }));
                                                        })
                                                    })

                                                    /*result = [
                                                        {
                                                            "imageName": "fbcbdec155126543a1c180b749df94b7.jpg",
                                                            "imageId": 149248775
                                                        },
                                                    ];*/
                                                    downLoadImageWinStore.proxy.data = result;//对象去重
                                                    downLoadImageWinStore.load();
                                                    downLoadImage.diySetDisabled(false);
                                                }
                                            }
                                        }
                                    })
                                }
                            }
                        }
                    },
                    {
                        xtype: 'combo',
                        name: 'orderLineItemId',
                        itemId: 'orderLineItemId',
                        editable: false,
                        allowBlank: false,
                        multiSelect: false,
                        matchFieldWidth: false,
                        fieldLabel: i18n.getKey('选择订单项'),
                        displayField: '_id',
                        valueField: '_id',
                        store: '',
                        disabled: true,
                    },
                    {
                        xtype: 'combo',
                        name: 'downLoadEnvironment',
                        itemId: 'downLoadEnvironment',
                        fieldLabel: i18n.getKey('下载环境'),
                        hidden: true,
                        disabled: true,
                        editable: false,
                        allowBlank: false,
                        displayField: 'key',
                        valueField: 'value',
                        tipInfo: '如果确认导入后,图片无法正确显示,请确认环境是否选择正确!',
                        value: 'dev-sz-qpson-nginx.qppdev.com',
                        store: Ext.create('Ext.data.Store', {
                            fields: [
                                'key', 'value'
                            ],
                            data: [
                                {
                                    key: '开发测试',
                                    value: 'dev-sz-qpson-nginx.qppdev.com',
                                },
                                {
                                    key: '内部测试',
                                    value: 'sz-nginx-test1.qppdev.com',
                                },
                                {
                                    key: 'stage',
                                    value: 'stage-dg-qpson.qppdev.com',
                                },
                                {
                                    key: 'release',
                                    value: 'release-dg-qpson.qppdev.com',
                                },
                                {
                                    key: 'cn_内部测试',
                                    value: 'test-qpmn-cn.qppdev.com',
                                },
                                {
                                    key: 'cn_stage',
                                    value: 'stage.popprint.cn',
                                },
                                {
                                    key: 'cn_release',
                                    value: 'www.popprint.cn',
                                }
                            ]
                        }),
                        listeners: {
                            change: function (comp, newValue) {
                                var form = comp.ownerCt,
                                    container = form.getComponent('container'),
                                    downLoadImage = form.getComponent('downLoadImage'),
                                    downLoadEnvironment = form.getComponent('downLoadEnvironment'),
                                    imageUrlArr = container.getComponent('imageUrlArr'),
                                    downLoadEnvironmentValue = downLoadEnvironment.getValue(),
                                    imageUrlValue = imageUrlArr.getValue(),
                                    isDeduplication = true, //是否去重
                                    prefixUrl = `https://${downLoadEnvironmentValue}/file/file/`,
                                    urlArr = JSON.parse(imageUrlValue),
                                    gridData = controller.getMemoryData(urlArr, isDeduplication);

                                downLoadImage._grid.imageServer = prefixUrl;
                                downLoadImage.winStore.proxy.data = gridData;
                                downLoadImage.winStore.load();
                            }
                        }
                    },
                    {
                        xtype: 'uxfieldcontainer',
                        name: 'container',
                        itemId: 'container',
                        layout: 'hbox',
                        hidden: true,
                        disabled: true,
                        defaults: {},
                        width: '100%',
                        items: [
                            {
                                xtype: 'textarea',
                                name: 'imageUrlArr',
                                itemId: 'imageUrlArr',
                                height: 300,
                                width: 600,
                                allowBlank: false,
                                tipInfo: "例如: [''7d47ba2851fecde3b73e74d986725fc9.png'']<br>常见问题: <br>1.最后一项不能带逗号 <br>2.必须是双引号 <br>3.已默认去重",
                                value: '',
                                fieldLabel: i18n.getKey('图片url数组'),
                            },
                            {
                                xtype: 'button',
                                text: i18n.getKey('确认导入'),
                                width: 120,
                                margin: '0 5 0 5',
                                handler: function (btn) {
                                    try {
                                        var container = btn.ownerCt,
                                            form = container.ownerCt,
                                            downLoadImage = form.getComponent('downLoadImage'),
                                            imageUrlArr = container.getComponent('imageUrlArr'),
                                            downLoadEnvironment = form.getComponent('downLoadEnvironment'),
                                            downLoadEnvironmentValue = downLoadEnvironment.getValue(),
                                            imageUrlValue = imageUrlArr.getValue(),
                                            isDeduplication = true, //是否去重
                                            prefixUrl = `https://${downLoadEnvironmentValue}/file/file/`,
                                            urlArr = JSON.parse(imageUrlValue),
                                            gridData = controller.getMemoryData(urlArr, isDeduplication);

                                        downLoadImage._grid.imageServer = prefixUrl;
                                        downLoadImage.winStore.proxy.data = gridData;
                                        downLoadImage.winStore.load();

                                        if (urlArr.length) {
                                            JSShowNotification({
                                                type: 'success',
                                                title: '导入成功!',
                                            });
                                        }
                                    } catch (e) {
                                        JSShowNotification({
                                            type: 'error',
                                            title: '未获取到合法url数组!',
                                        });
                                    }

                                }
                            },
                        ]
                    },
                    {
                        xtype: 'gridfieldwithcrudv2',
                        fieldLabel: i18n.getKey('图片下载列表'),
                        name: 'downLoadImage',
                        itemId: 'downLoadImage',
                        width: 900,
                        actionEditHidden: true,
                        allowBlank: true,
                        // disabled: true,
                        diySetDisabled: function (isDisabled) {
                            var me = this,
                                grid = me._grid;
                            me.setDisabled(isDisabled);
                            grid.setDisabled(isDisabled);
                        },
                        winStore: Ext.create('Ext.data.Store', {
                            fields: [
                                'imageName',
                                'imageId',
                                'productInstanceId',
                                {
                                    name: 'useCount',
                                    type: 'number',
                                }
                            ],
                            pageSize: 25,
                            proxy: {
                                type: 'pagingmemory'
                            },
                            data: []
                        }),
                        gridConfig: {
                            // disabled: true,
                            store: store,
                            imageServer: imageServer,
                            maxHeight: 500,
                            autoScroll: true,
                            selModel: {
                                selType: 'checkboxmodel',
                                mode: 'MULTI'
                            },
                            tbar: {
                                hiddenButtons: ['read', 'clear'],
                                btnCreate: {
                                    filteredData: [], //记录每次被过滤出来的数据
                                    setFilterStore: function () {
                                        var me = this,
                                            gridfieldwithcrudv2 = me.ownerCt.ownerCt.ownerCt,
                                            winStore = gridfieldwithcrudv2.winStore,
                                            store = gridfieldwithcrudv2._grid.store,
                                            mainStoreData = winStore.proxy.data,
                                            filterStoreData = store.proxy.data,
                                            filterIds = filterStoreData.map(item => {
                                                var data = item?.data || item;
                                                return data['imageId'];
                                            }),
                                            result = [];

                                        // 将上次被过滤的数据插回原来位置
                                        me.filteredData.forEach(item => {
                                            var {index, data} = item;
                                            mainStoreData.splice(index, 0, data);
                                        })

                                        me.filteredData = []; //重置过滤数据库
                                        mainStoreData.forEach((item, index) => {
                                            if (!filterIds.includes(item['imageId'])) {
                                                result.push(item);
                                            } else {
                                                // 记录本次被过滤数据 他在原来store中的数据和排序
                                                me.filteredData.push({
                                                    index: index,
                                                    data: item
                                                });
                                            }
                                        })

                                        console.log(result);
                                        winStore.proxy.data = result;
                                        winStore.load();
                                    },
                                    handler: function (btn) {
                                        var gridfieldwithcrudv2 = btn.ownerCt.ownerCt.ownerCt,
                                            winStore = gridfieldwithcrudv2.winStore,
                                            imageServer = gridfieldwithcrudv2._grid.imageServer,
                                            store = gridfieldwithcrudv2._grid.store;

                                        btn.setFilterStore();
                                        controller.createSelectImageGridWindow(winStore, imageServer, function (selected) {
                                            var result = selected.map(item => {
                                                return item?.data || item;
                                            })

                                            store.proxy.data = Ext.Array.merge(store.proxy.data, result);
                                            store.load();
                                        })
                                    }
                                },
                                btnDelete: {
                                    width: 90,
                                    menu: [
                                        {
                                            text: '删除选中项',
                                            handler: function (btn) {
                                                var grid = btn.parentMenu.ownerButton.ownerCt.ownerCt,
                                                    store = grid.store,
                                                    uniqueKey = 'imageName', //imageId 根据这个key作为唯一值做删除
                                                    selection = grid.getSelectionModel().getSelection(); // 获取选中的行

                                                // 检查是否选中行
                                                if (selection.length > 0) {
                                                    // 获取选中的 imageId
                                                    var imageIds = selection.map(function (record) {
                                                        return record.get(uniqueKey);
                                                    });

                                                    Ext.Msg.confirm('提示', `是否删除选中数据!`, function (code) {
                                                        if (code === 'yes') {
                                                            // 逐个查找并删除
                                                            imageIds.forEach(function (imageId) {
                                                                // 在 store.proxy.data 中找到对应的 rowIndex
                                                                var rowIndex = store.proxy.data.findIndex(function (item) {
                                                                    var data = item?.data || item;
                                                                    return data[uniqueKey] == imageId;
                                                                });

                                                                // 如果找到对应的 rowIndex，删除该数据
                                                                if (rowIndex !== -1) {
                                                                    store.proxy.data.splice(rowIndex, 1);
                                                                }
                                                            })
                                                            store.load();
                                                        }
                                                    });
                                                } else {
                                                    Ext.Msg.alert('提示', '请先选择要删除的数据!');
                                                }
                                            }
                                        },
                                        {
                                            text: '一键清空所有',
                                            handler: function (btn) {
                                                var grid = btn.parentMenu.ownerButton.ownerCt.ownerCt,
                                                    store = grid.store;

                                                Ext.Msg.confirm('提示', `是否确认清空数据!`, function (code) {
                                                    if (code === 'yes') {
                                                        store.proxy.data = [];
                                                        store.load();
                                                    }
                                                });
                                            }
                                        }
                                    ],
                                },
                                btnExport: {
                                    text: 'set',
                                    hidden: true,
                                    iconCls: 'icon_import',
                                    handler: function (btn) {
                                        var grid = btn.ownerCt.ownerCt,
                                            store = grid.store,
                                            data = [
                                                {
                                                    "imageName": "26311b7b797068758174cec07d208d25.jpg",
                                                    "imageId": 149248778,
                                                    "productInstanceId": "149425758"
                                                },
                                                {
                                                    "imageName": "c5781422ef80b6318acb2dc3c6553d57.jpg",
                                                    "imageId": 149424470,
                                                    "productInstanceId": "149425758"
                                                },
                                                {
                                                    "imageName": "97e43ecfe0615ce860429e28c5378de7.jpg",
                                                    "imageId": 149424469,
                                                    "productInstanceId": "149425758"
                                                }
                                            ];

                                        store.proxy.data = data;
                                        store.load();
                                    }
                                },
                                btnImport: {
                                    hidden: false,
                                    itemId: 'downLoad',
                                    text: i18n.getKey('下载'),
                                    onImageDownloadFn: function (isSuccess, message, btn) {
                                        var tools = btn.ownerCt,
                                            grid = tools.ownerCt,
                                            store = grid.store,
                                            storeLength = store.proxy.data.length,
                                            {
                                                completedDownloads,
                                                failedDownloads,
                                                totalFiles
                                            } = controller,
                                            progressBarContainer = tools.getComponent('progressBarContainer');

                                        progressBarContainer.setProgressbarText(`${completedDownloads}/${totalFiles}`);
                                    },
                                    onAllDownloadsCompleteFn: function (imageArray, filteredArray, btn) {
                                        var tools = btn.ownerCt,
                                            grid = tools.ownerCt,
                                            store = grid.store,
                                            progressBarContainer = tools.getComponent('progressBarContainer');

                                        btn.setDisabled(false);
                                        progressBarContainer.setVisible(false);
                                        store.proxy.data = Ext.Array.merge(filteredArray, imageArray);
                                        store.load();
                                        Ext.Msg.alert('提示', '图片已全部下载完成!');
                                    },
                                    handler: function (btn) {
                                        var tools = btn.ownerCt,
                                            grid = tools.ownerCt,
                                            store = grid.store,
                                            progressBarContainer = tools.getComponent('progressBarContainer'),
                                            result = store.proxy.data;

                                        if (result.length) {//result.length
                                            controller.createDownFileTypeFormWindow(null, function (data) {
                                                var {
                                                        downFile,
                                                        filterDowned,
                                                        downFileFormat,
                                                    } = data,
                                                    {downFileType, packageName} = downFile,
                                                    {isFilterDowned} = filterDowned,
                                                    filterResult = result.filter(item => {
                                                        return item['isSuccess'] !== 'success'
                                                    }),
                                                    newResult = isFilterDowned ? filterResult : result,
                                                    params = {
                                                        array: result,
                                                        packageName: packageName,
                                                        onImageDownload: btn.onImageDownloadFn,
                                                        onAllDownloadsComplete: btn.onAllDownloadsCompleteFn,
                                                        btn: btn,
                                                        isFilterDowned: isFilterDowned,
                                                        downFileFormat: downFileFormat
                                                    },
                                                    typeGather = {
                                                        file: function () {
                                                            controller.oneKeyDownLoadFiles(params, grid.imageServer);
                                                        },
                                                        package: function () {
                                                            controller.oneKeyDownLoadFiles(params, grid.imageServer);
                                                        }
                                                    }

                                                if (newResult.length) {
                                                    typeGather[downFileType]()
                                                    progressBarContainer.setVisible(true);
                                                    btn.setDisabled(true);
                                                } else {
                                                    Ext.Msg.alert('提示', '过滤后无可下载内容,请重选下载数据!')
                                                }
                                            })
                                        } else {
                                            Ext.Msg.alert('提示', '请选择需要下载的图片!')
                                        }

                                    }
                                },
                                btnConfig: {
                                    xtype: 'uxfieldcontainer',
                                    itemId: 'progressBarContainer',
                                    layout: 'hbox',
                                    width: 210,
                                    hidden: true,
                                    defaults: {
                                        margin: 0,
                                    },
                                    setProgressbarText: function (data) {
                                        var me = this,
                                            progressBar = me.getComponent('progressBar');

                                        data && progressBar.updateText(data);
                                    },
                                    items: [
                                        {
                                            xtype: 'progressbar',
                                            width: 160,
                                            animate: true,
                                            itemId: 'progressBar',
                                            hidden: true,
                                            listeners: {
                                                show: function (progressBar) {
                                                    var progressBarContainer = progressBar.ownerCt,
                                                        tools = progressBarContainer.ownerCt,
                                                        grid = tools.ownerCt,
                                                        store = grid.store,
                                                        storeLength = store.proxy.data.length,
                                                        {
                                                            completedDownloads,
                                                            failedDownloads,
                                                            totalFiles
                                                        } = controller,
                                                        progressBarText = `${0} / ${totalFiles}`;

                                                    progressBar.wait({
                                                        interval: 100, // 滚动间隔时间，单位为毫秒
                                                        increment: 30, // 每次滚动的增量
                                                        text: progressBarText, // 进度条显示的文本
                                                        scope: this,
                                                        fn: function () {
                                                            // 当进度条滚动完成时，重新开始滚动
                                                            progressBar.updateProgress(0);
                                                            progressBar.wait({
                                                                interval: 100,
                                                                increment: 30,
                                                                text: progressBarText,
                                                                scope: this,
                                                                fn: arguments.callee // 递归调用自身，实现循环滚动
                                                            });
                                                        }
                                                    });
                                                    progressBar.updateText(progressBarText);
                                                }
                                            }
                                        },
                                        {
                                            xtype: 'button',
                                            tooltip: `取消下载,将保存已下载图片!`,
                                            text: JSCreateFont('blue', false, '取消', 12, true, true),
                                            itemId: 'cancel',
                                            componentCls: "btnOnlyIcon",
                                            ui: 'default-toolbar-small',
                                            handler: function (btn) {
                                                var fieldcontainer = btn.ownerCt,
                                                    tools = fieldcontainer.ownerCt,
                                                    downLoad = tools.getComponent('downLoad')

                                                Ext.Msg.confirm('提示', '是否取消当前下载进程,并保存已下载文件？', function (selector) {
                                                    if (selector === 'yes') {

                                                        controller.cancelDownload(function () {
                                                            fieldcontainer.setVisible(false);
                                                            downLoad.setDisabled(false);
                                                            Ext.Msg.alert('提示', '下载进程取消成功!');
                                                        });
                                                    }
                                                })
                                            }
                                        },
                                    ],
                                    listeners: {
                                        show: function (comp) {
                                            var progressBar = comp.getComponent('progressBar');
                                            progressBar.setVisible(true);
                                        },
                                        hide: function (comp) {
                                            var progressBar = comp.getComponent('progressBar');
                                            progressBar.setVisible(false);
                                        }
                                    }
                                },
                                btnHelp: {
                                    xtype: 'uxfieldcontainer',
                                    itemId: 'promptContainer',
                                    layout: 'hbox',
                                    margin: '0 25 0 5',
                                    flex: 1,
                                    defaults: {
                                        margin: 0,
                                    },
                                    items: [
                                        {
                                            xtype: 'displayfield',
                                            width: 40,
                                            itemId: 'prompt',
                                            fieldLabel: JSCreateFont('#c13127', true, '提示'),
                                        },
                                        {
                                            xtype: 'button',
                                            text: JSCreateFont('grey', true, '未下载'),
                                            itemId: 'configCls',
                                            iconCls: 'icon_config',
                                            componentCls: "btnOnlyIcon",
                                        },
                                        {
                                            xtype: 'button',
                                            itemId: 'acceptCls',
                                            text: JSCreateFont('green', true, '下载完成'),
                                            iconCls: 'icon_accept',
                                            componentCls: "btnOnlyIcon",
                                        },
                                        {
                                            xtype: 'button',
                                            itemId: 'errorInfoCls',
                                            text: JSCreateFont('#c13127', true, '下载失败'),
                                            iconCls: 'icon_errorInfo',
                                            componentCls: "btnOnlyIcon",
                                        },
                                    ]
                                },
                            },
                            columns: [
                                {
                                    xtype: 'rownumberer',
                                    tdCls: 'vertical-middle',
                                    width: 60
                                },
                                {
                                    xtype: 'componentcolumn',
                                    text: i18n.getKey('id'),
                                    width: 120,
                                    align: 'center',
                                    dataIndex: 'imageName',
                                    renderer: function (value, metadata, record) {
                                        if (value) {
                                            var imageId = record.get('imageId'),
                                                isSuccess = record.get('isSuccess'),
                                                message = record.get('message'),
                                                typeGather = {
                                                    waiting: {
                                                        iconCls: 'icon_config',
                                                        toolTip: '未下载'
                                                    },
                                                    success: {
                                                        iconCls: 'icon_accept',
                                                        toolTip: '下载完成'
                                                    },
                                                    failure: {
                                                        iconCls: 'icon_errorInfo',
                                                        toolTip: `下载失败,原因: ${message}`
                                                    },
                                                },
                                                {iconCls, toolTip} = typeGather[isSuccess];

                                            return {
                                                xtype: 'container',
                                                width: '100%',
                                                layout: 'hbox',
                                                items: [
                                                    {
                                                        xtype: 'displayfield',
                                                        value: imageId,
                                                    },
                                                    {
                                                        xtype: 'button',
                                                        iconCls: iconCls,
                                                        componentCls: "btnOnlyIcon",
                                                        tooltip: toolTip,
                                                    }
                                                ]
                                            };
                                        }
                                    }
                                },
                                {
                                    xtype: 'imagecolumn',
                                    tdCls: 'vertical-middle',
                                    width: 100,
                                    dataIndex: 'imageName',
                                    align: 'center',
                                    text: i18n.getKey('image'),
                                    //订单的缩略图特殊位置
                                    buildUrl: function (value, metadata, record, rowIndex, colIndex, store, view) {
                                        var grid = view.ownerCt;
                                        return grid.imageServer + value;
                                    },
                                    //订单的缩略图特殊位置
                                    buildPreUrl: function (value, metadata, record, rowIndex, colIndex, store, view) {
                                        var grid = view.ownerCt;
                                        return grid.imageServer + value + '/100/100';
                                    },
                                    buildTitle: function (value, metadata, record) {
                                        return `${i18n.getKey('check')} < ${value} > 预览图`;
                                    }
                                },
                                {
                                    xtype: 'atagcolumn',
                                    text: i18n.getKey('url'),
                                    dataIndex: 'imageName',
                                    align: 'center',
                                    flex: 1,
                                    getDisplayName: function (value, metadata, record) {
                                        return JSCreateHyperLink(value);
                                    },
                                    clickHandler: function (value, metadata, record, rowIndex, colIndex, store, view) {
                                        var grid = view.ownerCt;
                                        window.open(grid.imageServer + value);
                                    }
                                },
                            ],
                            bbar: {
                                xtype: 'pagingtoolbar',
                                store: store,
                                displayInfo: true, // 是否 ? 示， 分 ? 信息
                                displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
                                emptyText: i18n.getKey('noDat')
                            }
                        },
                        winConfig: {
                            formConfig: {
                                isValidForItems: true,
                                getValue: function () {
                                    var me = this;
                                    return me.form.getValues();
                                },
                                setValue: function (data) {
                                    var me = this;
                                    return me.form.setValues(data);
                                },
                                defaults: {
                                    msgTarget: 'none',
                                    margin: '10 20',
                                    hideTrigger: true
                                },
                                items: []
                            }
                        },
                    }
                ]
            }
        ];

        me.callParent();
    },
    getValue: function () {
        var me = this,
            form = me.getComponent('form');
        return form.getValue();
    },
    setValue: function (data) {
        var me = this,
            form = me.getComponent('form');
        form.setValue(data);
    }
})