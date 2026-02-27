/**
 * @author xiu
 * @date 2023/9/21
 */
Ext.Loader.setPath({
    enabled: true,
    'CGP.orderdetails': path + 'partials/order/details/app/'
});
Ext.Loader.syncRequire([
    'CGP.builderpage.view.LeftSingleSelect',
    'CGP.builderpage.view.RightTools',
    'CGP.builderpage.view.CenterColor',
    'CGP.orderdetails.view.render.OrderLineItemRender',
    'CGP.orderlineitemv2.model.OrderLineItemByOrder',
    'CGP.orderitemsmultipleaddress.model.AuditContentPageModel'
])
Ext.define('CGP.builderpage.view.MainPage', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.mainPage',
    layout: 'fit',
    autoScroll: true,
    // 切换预览模式
    changePreviewModel: function (previewMode) {
        const me = this,
            tools = me.getDockedItems('toolbar[dock="top"]')[0],
            loadMask = new Ext.LoadMask(tools, {msg: '加载中...', msgCls: 'loading-mask-message'}),
            controller = Ext.create('CGP.builderpage.controller.Controller'),
            result = controller.previewImageFun(previewMode);

        // 开启工具栏遮罩层
        controller.setToolsMark(loadMask, true);

        // 向iframe中传递数据
        controller.callChild(result, function () {
            console.log('可编辑')
            // 关闭工具栏遮罩层
            controller.setToolsMark(loadMask, false);
        });
    },
    // 初始化页面的操作
    initPage: function (type, materialViews) {
        const me = this,
            tools = me.getDockedItems('toolbar[dock="top"]')[0],
            loadMask = new Ext.LoadMask(tools, {msg: '加载中...', msgCls: 'loading-mask-message'}),
            controller = Ext.create('CGP.builderpage.controller.Controller'),
            result = controller.changeAndBootstrap(type, materialViews);

        // 开启工具栏遮罩层
        controller.setToolsMark(loadMask, true);

        // 向iframe中传递数据
        controller.callChild(result, function () {
            me.loadPage('update');
            // 关闭工具栏遮罩层
            controller.setToolsMark(loadMask, false);
        });
    },
    // 刷新页面的操作
    loadPage: function (type, single) {
        const me = this,
            tools = me.getDockedItems('toolbar[dock="top"]')[0],
            loadMask = new Ext.LoadMask(tools, {msg: '加载中...', msgCls: 'loading-mask-message'}),
            items = tools.items.items,
            controller = Ext.create('CGP.builderpage.controller.Controller'),
            result = controller.mainQueryFun(items, type, single);

        // 开启工具栏遮罩层
        controller.setToolsMark(loadMask, true);

        // 向iframe中传递数据
        controller.callChild(result, function () {
            console.log('可编辑')
            // 关闭工具栏遮罩层
            controller.setToolsMark(loadMask, false);
        });
    },
    // 超时时间
    timeoutFun: function (time, evenType) {
        setTimeout(() => {
            const me = this,
                tools = me.getDockedItems('toolbar[dock="top"]')[0],
                rightTools = tools.getComponent('rightTools'),
                viewType = rightTools.getComponent('viewType'),
                newData = viewType.store.data.items,
                selectObject = viewType.getArrayValue(),
                selectMaterialCode = selectObject?.materialCode,
                idProperty = selectObject?.idProperty

            if (newData.length) {
                rightTools.dealInitData(viewType.store, idProperty);
                var previewMode = rightTools.getComponent('previewMode').getValue();
                rightTools.initPreviewPage(evenType, previewMode.previewMode);
            } else {
                // 第一次初始化失败 第二次及之后给三秒获取时间
                me.timeoutFun(3000, evenType);
            }

            JSSetLoading(false);
        }, time)
    },
    // 单行预览图数量 与 原图/自适应图片大小
    setImageQtyAndImageSize: function () {
        const me = this,
            tools = me.getDockedItems('toolbar[dock="top"]')[0],
            leftSingleSelect = tools.getComponent('leftSingleSelect'),
            rightTools = tools.getComponent('rightTools'),
            previewQty = rightTools.getComponent('previewQty'),
            LeftSingleSelectImageSize = leftSingleSelect.getComponent('LeftSingleSelectImageSize'),
            imageSizeValue = LeftSingleSelectImageSize.diyGetValue(),
            previewQtyValue = previewQty.getValue(),  //默认单行预览数量
            loadMask = new Ext.LoadMask(tools, {msg: '加载中...', msgCls: 'loading-mask-message'}),
            items = tools.items.items,
            controller = Ext.create('CGP.builderpage.controller.Controller'),
            result = controller.previewImageQtyAndImageSizeFun(previewQtyValue, imageSizeValue);

        // 开启工具栏遮罩层
        controller.setToolsMark(loadMask, true);

        // 向iframe中传递数据
        controller.callChild(result, function () {
            console.log('可编辑')
            // 关闭工具栏遮罩层
            controller.setToolsMark(loadMask, false);
        });
    },
    // 重置预览图数量 与 原图/自适应图片大小 (用于切换物料)
    resetQtyAndSize: function () {
        const me = this,
            tools = me.getDockedItems('toolbar[dock="top"]')[0],
            leftSingleSelect = tools.getComponent('leftSingleSelect'),
            rightTools = tools.getComponent('rightTools'),
            previewQty = rightTools.getComponent('previewQty'),
            LeftSingleSelectImageSize = leftSingleSelect.getComponent('LeftSingleSelectImageSize');

        previewQty.resetQty();
        LeftSingleSelectImageSize.resetSize();
    },
    // 设置禁启用单行预览张数12
    setDisabledPreviewQtyTwelve: function (isDisabled) {
        const me = this,
            tools = me.getDockedItems('toolbar[dock="top"]')[0],
            rightTools = tools.getComponent('rightTools'),
            previewQty = rightTools.getComponent('previewQty');

        previewQty.setDisabledPreviewQtyTwelve(isDisabled);
    },

    initComponent: function () {
        var me = this,
            controller = Ext.create('CGP.builderpage.controller.Controller'),
            defaults = Ext.create('CGP.builderpage.defaults.MainPageDefault'),
            {config, test9} = defaults,
            {
                id,
                seqNo,
                orderId,
                evenType,
                editType,
                statusId,
                orderNumber,
                productInstanceId,
                manufacturePreview,
                isRandomCardPage
            } = config,
            newAdminPath = adminPath.slice(0, adminPath.length - 10),
            isShowEdit = false, // 当状态在已审核待打印前 且 不存在builder地址时 不显示跳转编辑
            isBeforeStatus = Ext.Array.contains(['43', '100', '110', '101', '113', '116', '117', '118', '300', '301'], String(statusId)), //是否是生产前状态
            // orderLineItemData = JSGetQuery(adminPath + `api/orderItems/${id}/v2`),// 获取报关相关信息/api/orderItems/89440757/v2
            // orderLineItemRecord = new CGP.orderlineitemv2.model.OrderLineItemByOrder(orderLineItemData),
            // 预览有两个模式 一个是通过orderItem获取的预览  一个是通过designId获取的定制内容 根据isRandomCardPage判断其入口区别
            url = adminPath + `api/partners/orders/${orderId}/stores/products/designs?page=1&start=0&limit=25&filter= [{"name":"designId","operator":"exactMatch","value":"${productInstanceId}","type":"string"}]`,
            orderLineItemData = isRandomCardPage ? controller.getQuery(url)[0] : JSGetQuery(adminPath + `api/orderItems/${id}/v2`),
            orderLineItemRecord = isRandomCardPage ? new CGP.orderitemsmultipleaddress.model.AuditContentPageModel(orderLineItemData) : new CGP.orderlineitemv2.model.OrderLineItemByOrder(orderLineItemData),
            customsCategoryId = orderLineItemRecord.get('customsCategoryId'),
            customsCategoryDTOList = orderLineItemRecord.get('customsCategoryDTOList'),
            productDescription = orderLineItemRecord.get('productDescription'),
            isFinishedProduct = orderLineItemRecord.get('isFinishedProduct'),
            statusName = orderLineItemRecord.get('statusName'),
            orderItemStatusId = orderLineItemRecord.get('statusId'),
            designId = orderLineItemRecord.get('designId'),　//设计id
            //由于designMethod不能直接判断是否为随机固定 从而通过该字段是否存在判断是否为随机完成
            itemGenerateStatus = orderLineItemRecord.get('itemGenerateStatus'),
            designMethod = orderLineItemRecord.get('designMethod'),
            newDesignMethod = itemGenerateStatus ? 'RANDOM' : designMethod,
            fixDesignReview = orderLineItemRecord.get('fixDesignReview'),
            randomDesignReview = orderLineItemRecord.get('randomDesignReview'),
            isCustomsClearance = orderLineItemRecord.get('isCustomsClearance'), //是否需要报关的特殊标识
            newValue = newDesignMethod || 'FIX',
            originButtonText = isRandomCardPage ? '确认完成审核' : '审批订单项图库',
            typeGather = {
                RANDOM: {
                    isAudited: randomDesignReview,
                    buttonText: randomDesignReview ? '已审核,跳转内容审核页' : originButtonText,
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
                    isAudited: fixDesignReview,
                    buttonText: fixDesignReview ? '已审核,跳转内容审核页' : originButtonText,
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
            {isAudited, buttonText, JSOpenBuilderPage} = typeGather[newValue],
            isAuditPending = [110, 101].includes(+orderItemStatusId), //待审核状态
            isShowCustomsCategory = Ext.Array.contains(['43', '100', '110', '101', '113', '116', '117', '118', '300', '301'], String(statusId)),// 验证是否显示报关分类
            isShowCategory = (isShowCustomsCategory && isCustomsClearance),//是否需要显示报关相关业务，需要报关，且有多个报关分类可供选择时显示
            isShowAuditedContentBtn = isFinishedProduct || isAudited;

        if (isBeforeStatus) {
            var editUrl = `${adminPath}api/builder/resource/${editType}/url/latest?productInstanceId=${productInstanceId}&language=zh&platform=PC`,
                editData = controller.getQuery(editUrl);
            //有数据的时候可以编辑
            isShowEdit = !Ext.isEmpty(editData);
        }

        me.tbar = {
            layout: 'column',
            items: [
                {
                    xtype: 'panel',
                    itemId: 'form',
                    defaults: {
                        xtype: 'displayfield',
                        labelWidth: 60
                    },
                    margin: '10 0 0 10',
                    bodyStyle: 'border-top: none; border-bottom: none;border-left: none;',
                    hidden: isRandomCardPage,
                    items: [
                        {
                            xtype: 'atag_displayfield',
                            fieldCls: 'x-form-display-field',
                            tooltip: `${orderNumber}第${seqNo}个订单项`,
                            fieldLabel: i18n.getKey('订单项'),
                            value: `${orderNumber}_${seqNo}`
                        },
                        {
                            fieldLabel: i18n.getKey('状态'),
                            value: JSCreateFont('red', true, i18n.getKey(statusName))
                        },
                        {
                            xtype: 'atag_displayfield',
                            fieldLabel: i18n.getKey('产品描述'),
                            fieldCls: 'x-form-display-field',
                            tooltip: productDescription,
                            listeners: {
                                afterrender: function (comp) {
                                    var truncatedStr = '';
                                    if (productDescription?.length > 17) {
                                        truncatedStr = productDescription.substring(0, 15) + ' ...';
                                    }
                                    comp.setValue(truncatedStr);
                                }
                            }
                        },
                    ],
                    maxHeight: 80,
                    minWidth: 250,
                    flex: 0.6,
                },
                {
                    xtype: 'leftSingleSelect',
                    name: 'leftSingleSelect',
                    itemId: 'leftSingleSelect',
                    parentComp: me,
                    minWidth: 300,
                    flex: 1,
                },
                {
                    xtype: 'centerColor',
                    name: 'centerColor',
                    itemId: 'centerColor',
                    bodyStyle: 'border-top: none; border-bottom: none;',
                    parentComp: me,
                    minWidth: 450,
                    height: 80,
                    flex: 1,
                },
                {
                    xtype: 'rightTools',
                    name: 'rightTools',
                    itemId: 'rightTools',
                    parentComp: me,
                    orderItemId: id,
                    isRandomCardPage: isRandomCardPage,
                    productInstanceId: productInstanceId,
                    minWidth: 350,
                    flex: 1.2,
                }
            ]
        };
        me.bbar = {
            // hidden: !isShowEdit && !isShowCategory,
            items: [
                {
                    xtype: 'button',
                    itemId: 'edit',
                    iconCls: 'icon_edit',
                    margin: '10 0 0 10',
                    hidden: !isShowEdit,
                    text: JSCreateFont(null, false, '跳转编辑', 12, false, true),
                    handler: function (btn) {
                        const me = btn.ownerCt.ownerCt;
                        JSOpen({
                            id: 'editBuilder',
                            url: newAdminPath + editData +
                                '?productInstanceId=' + productInstanceId +
                                '&useTestVersion=true' +
                                '&token_type=bearer' +
                                '&access_token=' + Ext.util.Cookies.get('token'),
                            title: i18n.getKey('编辑Builder'),
                            refresh: true
                        });
                    }
                },
                {
                    xtype: 'tbseparator'
                },
                {
                    xtype: 'container',
                    itemId: 'container',
                    name: 'container',
                    layout: 'hbox',
                    width: 380,
                    defaults: {
                        margin: '5 0 5 10',
                    },
                    hidden: !customsCategoryDTOList?.length || !isShowCategory || isRandomCardPage, //存在报关列表才显示
                    items: [
                        {
                            xtype: 'combo',
                            store: {
                                fields: [
                                    {
                                        name: '_id',
                                        type: 'string'
                                    },
                                    {
                                        name: 'outName',
                                        type: 'string'
                                    }
                                ],
                                data: customsCategoryDTOList
                            },
                            valueField: '_id',
                            itemId: 'customsCategoryCombo',
                            displayField: 'outName',
                            editable: false,
                            emptyText: '--select--',
                            value: customsCategoryId,
                            fieldLabel: i18n.getKey('报关产品分类')
                        },
                        {
                            xtype: 'button',
                            itemId: 'save',
                            text: i18n.getKey('保存分类'),
                            handler: function (btn) {
                                var customsCategoryId = btn.ownerCt.getComponent('customsCategoryCombo').getValue();
                                if (!Ext.isEmpty(customsCategoryId)) {
                                    var url = adminPath + 'api/orderItems/' + id + '/checkCustomsCategory' +
                                        '?customsCategoryId=' + customsCategoryId;

                                    JSAjaxRequest(url, "PUT", true, null, i18n.getKey('saveSuccess'), function (require, success, response) {
                                        if (success) {
                                            var responseText = Ext.JSON.decode(response.responseText);
                                            if (responseText.success) {
                                                JSSendFrameMessage('all', {
                                                    orderLineItemId: id,
                                                    customsCategoryId: customsCategoryId
                                                });
                                                setTimeout(() => {
                                                    location.reload();
                                                }, 2000)
                                            }
                                        }
                                    });
                                }
                            }
                        },
                    ]
                },
                {
                    xtype: 'button',
                    text: '刷新',
                    margin: '0 0 0 10',
                    iconCls: 'icon_refresh',
                    handler: function () {
                        location.reload();
                    }
                },
                {
                    xtype: 'button',
                    itemId: 'text',
                    margin: '0 0 0 10',
                    text: JSCreateFont('red', true, i18n.getKey('定制内容已审核')),
                    componentCls: "btnOnlyIcon",
                    hidden: !isAudited, //已审核显示
                },
                '->',
                {
                    xtype: 'container',
                    itemId: 'auditBtn',
                    name: 'auditBtn',
                    layout: 'hbox',
                    margin: '0 10',
                    defaults: {
                        margin: '0 10 0 0',
                    },
                    hidden: isRandomCardPage ? false : !isAuditPending,
                    items: [
                        {
                            xtype: 'button',
                            itemId: 'auditOrderItemBtn',
                            text: i18n.getKey('审批订单项'),
                            hidden: isRandomCardPage,
                            auditQuery: function () {
                                var mainRenderer = Ext.create('CGP.orderdetails.view.render.OrderLineItemRender');

                                mainRenderer.createOrderItemAuditFormWindow(null, function (win, data) {
                                    var url = adminPath + `api/orderItems/${id}/audit`;

                                    JSAsyncEditQuery(url, data, true, function (require, success, response) {
                                        if (success) {
                                            var responseText = Ext.JSON.decode(response.responseText),
                                                data = responseText?.data;

                                            if (responseText.success) {

                                                win.close();
                                                JSShowNotification({
                                                    type: 'success',
                                                    title: '订单项审核完成!',
                                                })
                                                setTimeout(item => {
                                                    location.reload();
                                                }, 2000)
                                            } else {
                                                var errorCode = data?.code,
                                                    errorParams = data?.errorParams,
                                                    orderItemIds = errorParams?.orderItemIds,
                                                    codeGather = {
                                                        108000358: '订单项随机状态未完成!',
                                                        108000359: `审核前需完成报关分类!`,
                                                        108000360: '关联的订单未完成后续数据处理!'
                                                    }

                                                if ([108000358, 108000359, 108000360].includes(errorCode)) {
                                                    Ext.Msg.alert('提示', codeGather[errorCode]);
                                                }
                                            }
                                        }
                                    }, true)
                                });
                            },
                            handler: function (btn) {
                                if (isCustomsClearance) { //需报关
                                    if (customsCategoryId) { // 已报关才能审核
                                        btn.auditQuery();
                                    } else {
                                        JSShowNotification({
                                            type: 'info',
                                            title: '请完备报关分类!',
                                        });
                                    }

                                } else {  //不用报关的可直接审核
                                    btn.auditQuery();
                                }
                            }
                        },
                        {
                            xtype: 'button',
                            itemId: 'auditOrderItemContentBtn',
                            text: i18n.getKey(buttonText),
                            // hidden: true, //先提交部分
                            hidden: isShowAuditedContentBtn, //已审核隐藏
                            handler: function (btn) {
                                var isAuditedGather = {
                                        true: {
                                            url: adminPath + `api/products/designs/${designId}/cancel`,
                                            msg: '撤销成功; 相同定制内容的订单项的内容审核都将“撤销审核”!',
                                            confirmMsg: '跳转进入内容审核页!',
                                        },
                                        false: {
                                            url: adminPath + `api/products/designs/${designId}/review`,
                                            msg: '审核成功; 相同定制内容的订单项的内容审核都将标记为“已审核”!',
                                            confirmMsg: isRandomCardPage ? '是否确认对随机卡图库与定制内容完成审核?' : '是否确认对定制内容完成审核?',
                                        },
                                    },
                                    {url, msg, confirmMsg} = isAuditedGather[isAudited],
                                    result = {
                                        orderIds: [orderId],
                                        orderItemIds: [],
                                    }

                                function JSOpenAuditContentPage(orderId, statusId, orderNumber) {
                                    JSOpen({
                                        id: 'orderitemauditcontent',
                                        url: path + "partials/orderitemsmultipleaddress/auditContentPage.html" +
                                            "?id=" + orderId +
                                            "&status=" + statusId +
                                            "&orderNumber=" + orderNumber,
                                        title: i18n.getKey(`批量审批订单项内容 (${orderId})`),
                                        refresh: true
                                    })
                                    location.reload();
                                }

                                // 已审核 直接进入
                                if (isAudited) {
                                    JSOpenAuditContentPage(orderId, statusId, orderNumber);
                                } else {

                                    if (newValue === 'FIX' || isRandomCardPage) {
                                        Ext.Msg.confirm('提示', confirmMsg, function (selector) {
                                            if (selector === 'yes') {
                                                JSAsyncEditQuery(url, result, false, function (require, success, response) {
                                                    if (success) {
                                                        var responseText = Ext.JSON.decode(response.responseText);
                                                        if (responseText.success) {
                                                            Ext.Msg.alert('提示', msg, function () {
                                                                JSOpenAuditContentPage(orderId, statusId, orderNumber);
                                                            })
                                                        }
                                                    }
                                                })
                                            }
                                        })
                                    } else {
                                        JSOpenBuilderPage();
                                    }
                                }

                            }
                        }
                    ]
                },
            ]
        };
        me.items = [
            {
                id: 'builderView',
                html: '<iframe id="tabs_iframe" src= "' + manufacturePreview + '" width="100%" height="100%"></iframe>',
                listeners: {
                    afterrender: function (comp) {
                        JSSetLoading(true);
                        controller.getIframeInfoFn('Builder加载超时,请重试!', function (e, loadTime) {
                            let data = e.data;
                            typeof data === 'string' && (data = JSON.parse(data))
                            const {type, args} = data;

                            if ((type === 'qp.builder.production.afterViewInit') && args) {
                                console.log('Builder加载完成,开始发送事件!');
                                clearTimeout(loadTime);
                                me.timeoutFun(1000, evenType);
                            }
                        }, 50000)//构建超时设置50s
                    }
                }
            }
        ];
        me.callParent();
    },
})
