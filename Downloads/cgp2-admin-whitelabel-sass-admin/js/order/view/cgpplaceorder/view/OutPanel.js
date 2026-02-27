/**
 * Created by nan on 2019/9/3.
 */
Ext.define('CGP.order.view.cgpplaceorder.view.OutPanel', {
    extend: 'Ext.panel.Panel',
    requires: ['CGP.order.view.cgpplaceorder.view.CreateOrderLineItemPanel'],
    productMaterialViewTypes: null,//引用数组
    materialViewTypes: null,//实例数组
    hadUpLoadPanelCount: 0,//记录了多少个panel已经完成文件的提交
    fileUploadResponseData: [],//记录对应的提交后的返回数据,
    productConfig: null,
    productId: null,
    layout: 'border',
    title: i18n.getKey('上传产品定制文件'),
    errorInfo: null,//各个步骤的错误信息
    controller: Ext.create('CGP.order.view.cgpplaceorder.controller.Controller'),
    getValue: function () {
        var me = this;
        return me.fileUploadResponseData;
    },
    isValid: function () {
        var me = this;
        var isValid = true;
        var centerPanel = me.getComponent('centerPanel');
        var leftTreePanel = me.getComponent('leftTreePanel');
        for (var i = 0; i < centerPanel.items.items.length; i++) {
            var item = centerPanel.items.items[i];
            if (item.isValid() == false) {
                Ext.Msg.alert(i18n.getKey('prompt'), '在' + item.title + '选项卡中，选择的pdf数量，不符合所需数量', function () {
                    var record = leftTreePanel.getRootNode().findChild('_id', item.itemId, true)
                    leftTreePanel.getSelectionModel().select(record);
                });
                isValid = false;
                break;
            }
        }
        return isValid;
    },
    initComponent: function () {
        var me = this;
        me.errorInfo = [];
        //添加自定义事件
        this.addEvents({
            doNextStep: true,//选择的文件数量发生改变
        });
        me.items = [];
        //添加对应的page
        me.bbar = [
            '->',
            {
                text: i18n.getKey('nextStep'),
                iconCls: 'icon_next_step',
                itemId: 'nextStep',
                handler: function (btn) {
                    var outPanel = btn.ownerCt.ownerCt;
                    if (outPanel.isValid()) {
                        outPanel.el.mask('生成订单项中...');
                        var centerPanel = outPanel.getComponent('centerPanel');
                        for (var i = 0; i < centerPanel.items.items.length; i++) {
                            var item = centerPanel.items.items[i];
                            outPanel.controller.uploadFiles(item);
                        }
                    }
                }
            }
        ];
        me.listeners = {
            //渲染完成后，tab监听各个panel中执行的提交文件操作
            afterrender: function () {
                var outPanel = this;
                var centerPanel = outPanel.getComponent('centerPanel');
                for (var i = 0; i < centerPanel.items.items.length; i++) {
                    var item = centerPanel.items.items[i];
                    outPanel.relayEvents(item, ['uploadFilesSuccess']);
                }
            },
            /**
             * 监听各个panel上传文件
             * @param argObj
             */
            uploadFilesSuccess: function (argObj) {
                var outPanel = this;
                var centerPanel = outPanel.getComponent('centerPanel');
                if (argObj.success == true) {
                    outPanel.hadUpLoadPanelCount++;
                    outPanel.fileUploadResponseData.push(argObj.data);
                } else {
                    outPanel.hadUpLoadPanelCount++;
                    outPanel.errorInfo.push(argObj.data.message);

                }

                if (outPanel.hadUpLoadPanelCount == centerPanel.items.items.length) {
                    outPanel.el.unmask();
                    if (outPanel.errorInfo.length > 0) {
                        var errorStr = '';
                        outPanel.hadUpLoadPanelCount = 0;
                        for (var i = 0; i < outPanel.errorInfo.length; i++) {
                            errorStr += outPanel.errorInfo[i] + '<br>';
                        }
                        Ext.Msg.alert(i18n.getKey('prompt'), errorStr);
                        outPanel.errorInfo = [];
                        outPanel.hadUpLoadPanelCount = 0;
                    } else {
                        outPanel.fireEvent('doNextStep', {
                            fileUploadResponseData: outPanel.fileUploadResponseData
                        });
                        outPanel.hadUpLoadPanelCount = 0;
                    }

                }
            },
            /**
             * 下一步中需要执行的逻辑
             */
            doNextStep: function (data) {
                var outPanel = this;
                var pageContentData = [];
                //生成pageContent
                for (var i = 0; i < data.fileUploadResponseData.length; i++) {
                    var pageContentSchema = outPanel.controller.getPageContentSchema(data.fileUploadResponseData[i].pageContentSchemaId);
                    var pageContentArr = outPanel.controller.createPageContent(pageContentSchema, data.fileUploadResponseData[i].files, outPanel);
                    if (pageContentArr.length == 0) {
                        break;
                    }
                    pageContentData.push({
                        materialViewType: data.fileUploadResponseData[i].materialViewType,
                        productMaterialViewType: data.fileUploadResponseData[i].productMaterialViewType,
                        pageContentArr: pageContentArr,
                        files: data.fileUploadResponseData[i].files,
                        width: pageContentSchema.width,
                        height: pageContentSchema.height
                    });
                }
                if (pageContentData.length != data.fileUploadResponseData.length) {
                    Ext.Msg.alert(i18n.getKey('prompt'), '生成pageContent失败');
                    return;
                }
                //生成productInstance
                var productInstance = outPanel.controller.buildProductInstance(pageContentData, outPanel);
                if (Ext.isEmpty(productInstance)) {
                    Ext.Msg.alert(i18n.getKey('prompt'), '生成productInstance失败');
                    outPanel.el.unmask();
                    return;
                }
                //生成订单项
                outPanel.controller.createDiyOrderItem(productInstance);
                outPanel.el.unmask();
                outPanel.fileUploadResponseData = [];


                //执行完后,跳转到订单项页面
                var placeOrderOutTab = Ext.getCmp('placeOrderOutTab');
                var orderItemGrid = placeOrderOutTab.getComponent('orderItemGrid');
                placeOrderOutTab.setActiveTab(orderItemGrid);
                orderItemGrid.refreshData();
            }
        };
        me.callParent();

    }
})
