/**
 * 统一的订单项显示功能
 */
Ext.Loader.syncRequire([
    'CGP.common.commoncomp.QueryGrid'
])
Ext.define('CGP.orderitemsmultipleaddress.view.auditContentGrid', {
    extend: 'CGP.common.commoncomp.QueryGrid',
    alias: 'widget.audit_content_grid',
    mainRenderer: Ext.create('CGP.orderdetails.view.render.OrderLineItemRender'),
    viewConfig: {
        enableTextSelection: true,
    },
    autoScroll: true,
    diySetConfig: Ext.emptyFn,//自定义对已有配置的修改
    store: null,
    pageType: null,
    order: null,//订单信息
    maxHeight: 1000,
    unConfirmItem: null,//记录为确定报关分类的订单项
    isShowClickItem: null,
    /* @cfg 记录跨页选中的记录 */
    selectedRecords: null,
    deleteItemIndex: null,
    selModel: {
        selType: 'checkboxmodel',
        mode: 'MULTI'
    },
    hiddenTitle: false,
    initComponent: function () {
        var me = this,
            {hiddenTitle, orderId, orderStatusId, order, remark} = me,
            mainRenderer = this.mainRenderer,
            items = [],
            orderItem = mainRenderer.getOrderItemCfgV2({
                grid: me,
                remark: remark,
                orderId: orderId,
                orderStatusId: orderStatusId,
            }, me.pageType, me.isShowClickItem);

        mainRenderer.order = order;

        me.gridCfg = {
            store: me.store,
            autoScroll: true,
            editAction: false,
            deleteAction: false,
            showRowNum: false,
            viewConfig: {},
            selModel: me.selModel,
            customPaging: [
                {value: 25},
                {value: 50},
                {value: 75},
                {value: 150},
            ],
            diySetConfig: Ext.emptyFn,//自定义对已有配置的修改
            defaults: {
                sortable: false,
                menuDisabled: true
            },
            columns: [
                // orderItem.get('0'),
                // orderItem.get('7'),
                {
                    xtype: 'rownumberer',
                    tdCls: 'vertical-middle',
                    width: 45
                },
                {
                    xtype: 'imagecolumn',
                    tdCls: 'vertical-middle',
                    width: 150,
                    dataIndex: 'previewImage',
                    text: i18n.getKey('图片'),
                    //短大图
                    buildUrl: function (value, metadata, record) {
                        var {thumbnail} = value;
                        return projectThumbServer + thumbnail;
                    },
                    //长小图
                    buildPreUrl: function (value, metadata, record) {
                        var {thumbnail} = value;
                        return projectThumbServer + thumbnail + '/150/150';
                    },
                    buildTitle: function (value, metadata, record) {
                        var {source} = value;
                        return `${i18n.getKey('check')} < ${source} > 预览图`;
                    }
                },
                orderItem.get('5'),
                orderItem.get('11'),
                {
                    dataIndex: 'designId',
                    text: i18n.getKey('产品定制类型'),
                    width: 150,
                    renderer: function (value, metadata, record) {
                        //由于designMethod不能直接判断是否为随机固定 从而通过该字段是否存在判断是否为随机完成
                        var itemGenerateStatus = record.get('itemGenerateStatus'),
                            designMethod = record.get('designMethod'),
                            newDesignMethod = itemGenerateStatus ? 'RANDOM' : designMethod,
                            productTypeGather = {
                                FIX: i18n.getKey('固定定制'),
                                RANDOM: i18n.getKey('随机定制'),
                            }

                        return productTypeGather[newDesignMethod || 'FIX'];
                    }
                },
                {
                    dataIndex: 'itemCountInDesignId',
                    text: i18n.getKey('订单项数量（本单）'),
                    width: 150,
                    renderer: function (value, metadata, record) {
                        return JSCreateFont('blue', true, value);
                    }
                },
                {
                    dataIndex: 'totalItemQtyInDesignId',
                    text: i18n.getKey('下单数量（本单）'),
                    width: 150,
                    renderer: function (value, metadata, record) {
                        return value;
                    }
                },
                {
                    xtype: 'atagcolumn',
                    text: i18n.getKey('操作'),
                    dataIndex: 'designId',
                    align: 'center',
                    width: 150,
                    getDisplayName: function (value, metadata, record) {
                        var designMethod = record.get('designMethod'),
                            isFinishedProduct = record.get('isFinishedProduct'), //成品单无需审核
                            itemGenerateStatus = record.get('itemGenerateStatus'),
                            newDesignMethod = itemGenerateStatus ? 'RANDOM' : designMethod,
                            newValue = newDesignMethod || 'FIX',
                            typeGather = {
                                RANDOM: {
                                    text: i18n.getKey('审核图库'),
                                    isAudited: record.get('randomDesignReview')
                                },
                                FIX: {
                                    text: i18n.getKey('审核内容'),
                                    isAudited: record.get('fixDesignReview')
                                },
                            },
                            {text, isAudited} = typeGather[newValue],
                            auditedText = i18n.getKey('撤销审核'),
                            resultText = isAudited ? auditedText : text;

                        return isFinishedProduct ? '' : JSCreateHyperLink(resultText);
                    },
                    clickHandler: function (value, metadata, record) {
                        var designId = record.get('designId'),
                            designMethod = record.get('designMethod'),
                            itemGenerateStatus = record.get('itemGenerateStatus'),
                            status = JSGetQueryString('status'),
                            newDesignMethod = itemGenerateStatus ? 'RANDOM' : designMethod,
                            newValue = newDesignMethod || 'FIX',
                            manufacturePreview = JSGetQuery(adminPath + `api/builder/resource/manufacturePreview/url/latest?productInstanceId=${designId}&language=zh&platform=PC`),
                            typeGather = {
                                RANDOM: {
                                    text: i18n.getKey('审核图库'),
                                    isAudited: record.get('randomDesignReview'),
                                    JSOpenBuilderPage: function () {
                                        JSOpen({
                                            id: JSGetUUID(),
                                            url: path + 'partials/builderrandomcardpage/main.html' +
                                                '?orderId=' + orderId +
                                                '&productInstanceId=' + designId +
                                                '&manufacturePreview=' + manufacturePreview,
                                            title: i18n.getKey('内容审核'),
                                            target: 'win',
                                            refresh: true,
                                        });
                                    }
                                },
                                FIX: {
                                    text: i18n.getKey('审核内容'),
                                    isAudited: record.get('fixDesignReview'),
                                    JSOpenBuilderPage: function () {
                                        JSOpen({
                                            id: JSGetUUID(),
                                            url: path + 'partials/builderpage/main.html' +
                                                '?orderId=' + orderId +
                                                '&productInstanceId=' + designId +
                                                '&manufacturePreview=' + manufacturePreview +
                                                '&isRandomCardPage=' + true,
                                            title: i18n.getKey('内容审核'),
                                            target: 'win',
                                            refresh: true,
                                        });
                                    }
                                },
                            },
                            auditedUrl = `api/products/designs/${designId}/review`,
                            cancelAuditedUrl = `api/products/designs/${designId}/cancel`,
                            {text, isAudited, JSOpenBuilderPage} = typeGather[newValue],
                            isAuditedGather = {
                                true: {
                                    affirmMsg: '是否确认撤销审核?',
                                    backMsg: '撤销成功!',
                                    suffixUrl: cancelAuditedUrl,
                                },
                                false: {
                                    affirmMsg: '是否确认完成审核?',
                                    backMsg: '审核成功!',
                                    suffixUrl: auditedUrl,
                                }
                            },
                            {affirmMsg, suffixUrl, backMsg} = isAuditedGather[isAudited],
                            url = adminPath + suffixUrl,
                            //内容审核会对所有拥有相同designId的订单做审核 加该orderId的作用是 优先对当前订单做审核
                            postData = {
                                orderIds: [orderId],
                            }

                        if (isAudited) {
                            Ext.Msg.confirm('提示', affirmMsg, function (btn) {
                                if (btn === 'yes') {

                                    JSAsyncEditQuery(url, postData, false, function (require, success, response) {
                                        if (success) {
                                            var responseText = Ext.JSON.decode(response.responseText),
                                                data = responseText?.data;

                                            if (responseText.success) {
                                                me.store.load();
                                                Ext.Msg.alert('提示', backMsg);
                                            }
                                        }
                                    }, true)
                                }
                            });
                        } else {
                            JSOpenBuilderPage();
                        }
                    }
                },
                Ext.Object.merge(orderItem.get('8'), {
                    minWidth: 250,
                    flex: 1,
                })
            ],
        }

        me.filterCfg = {
            header: false,
            minHeight: 45,
            bodyStyle: 'border: 1px solid #c0c0c0;',
            border: '1 1 0 1',
            layout: {
                type: 'column',
                columns: 2
            },
            defaults: {
                margin: '10 10 5 10'
            },
            items: [
                {
                    xtype: 'textfield',
                    name: 'storeProductId',
                    itemId: 'storeProductId',
                    isLike: false,
                    hideTrigger: true,
                    // isMultiSelect: true, //是否开启多选查询
                    valueType: 'string',
                    // enforceMaxLength: true,
                    labelWidth: 100,
                    // tipInfo: '该字段可通过(,)实现多数据查询,例如: 327486849,327486852',
                    fieldLabel: i18n.getKey('店铺产品Id'),
                },
                {
                    xtype: 'combo',
                    fieldLabel: i18n.getKey('内容审核'),
                    name: 'designReview',
                    itemId: 'designReview',
                    valueField: 'value',
                    displayField: 'text',
                    haveReset: true,
                    editable: false,
                    store: {
                        fields: ['value', 'text'],
                        data: [
                            {
                                text: i18n.getKey('未审核'),
                                value: false
                            },
                            {
                                text: i18n.getKey('已审核'),
                                value: true
                            },
                        ]
                    },
                },
                {
                    xtype: 'combo',
                    fieldLabel: i18n.getKey('产品定制类型'),
                    name: 'itemGenerateStatus',
                    itemId: 'itemGenerateStatus', //暂时只能通过itemGenerateStatus判断固定随机
                    tipInfo: '暂时只能通过itemGenerateStatus字段判断固定随机',
                    valueField: 'value',
                    displayField: 'text',
                    haveReset: true,
                    editable: false,
                    isLike: false,
                    labelWidth: 100,
                    store: {
                        fields: ['value', 'text'],
                        data: [
                            /* {
                                 text: i18n.getKey('固定定制'),
                                 value: 'FIX'
                             },*/
                            {
                                text: i18n.getKey('随机定制'),
                                value: 'SUCCESS'
                            },
                        ]
                    }
                }
            ],
        }

        mainRenderer.order = order;

        me.diySetConfig();
        me.callParent(arguments);
    },
})

