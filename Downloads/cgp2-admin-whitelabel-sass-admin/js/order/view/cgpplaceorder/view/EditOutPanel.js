/**
 * Created by nan on 2019/9/5.
 */
Ext.define('CGP.order.view.cgpplaceorder.view.EditOutPanel', {
    extend: 'Ext.panel.Panel',
    title: i18n.getKey(''),
    layout: 'border',
    requires: ['CGP.order.view.cgpplaceorder.view.CreateOrderLineItemPanel'],
    controller: Ext.create('CGP.order.view.cgpplaceorder.controller.Controller'),
    productInstance: null,
    productId: null,
    hadUpLoadPanelCount: 0,//记录以及上传的Panel的数量
    needUploadPaneCount: 0,//记录有添加新的pdf文件的panel数量
    productConfig: null,
    record: null,//orderLineItemGrid中的一条记录
    errorInfo: null,
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
        me.productInstance = me.productConfig;
        this.addEvents({
            doNextStep: true,//选择的文件数量发生改变
        });
        me.items = [];
        //添加对应的page
        me.bbar = [
            '->',
            {
                text: i18n.getKey('confirm'),
                iconCls: 'icon_agree',
                itemId: 'confirm',
                handler: function (btn) {
                    var outPanel = btn.ownerCt.ownerCt;
                    var centerPanel = outPanel.getComponent('centerPanel');
                    if (outPanel.isValid()) {
                        outPanel.el.mask('修改中...');
                        setTimeout(function () {
                            outPanel.needUploadPaneCount = 0;
                            for (var i = 0; i < centerPanel.items.items.length; i++) {
                                var item = centerPanel.items.items[i];
                                if (item.fileArray.length > 0) {//有新加的文件
                                    outPanel.needUploadPaneCount++;
                                }
                            }
                            for (var i = 0; i < centerPanel.items.items.length; i++) {
                                var item = centerPanel.items.items[i];
                                if (item.fileArray.length > 0) {//有新加的文件
                                    centerPanel.items.items[i].uploadFiles();
                                }
                            }
                            if (outPanel.needUploadPaneCount == 0) {
                                centerPanel.items.items[0].fireEvent('uploadFilesSuccess', {
                                    success: true
                                });
                            }
                        }, 100);

                    }
                }
            }
        ];
        me.listeners = {
            //渲染完成后，outPanel监听各个panel中执行的提交文件操作
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
                if (outPanel.needUploadPaneCount == 0) {
                    outPanel.fireEvent('doNextStep', {});
                } else {
                    if (argObj.success == true) {
                        outPanel.hadUpLoadPanelCount++;
                    } else if (argObj.success == false) {
                        outPanel.hadUpLoadPanelCount++;
                        outPanel.errorInfo.push(argObj.data.message);
                    }
                    if (outPanel.hadUpLoadPanelCount == outPanel.needUploadPaneCount) {
                        outPanel.el.unmask();
                        if (outPanel.errorInfo.length > 0) {
                            outPanel.hadUpLoadPanelCount = 0;
                            var errorStr = '';
                            for (var i = 0; i < outPanel.errorInfo.length; i++) {
                                errorStr += outPanel.errorInfo[i] + '<br>';
                            }
                            Ext.Msg.alert(i18n.getKey('prompt'), errorStr);
                            outPanel.errorInfo = [];
                            outPanel.hadUpLoadPanelCount = 0;
                        } else {
                            outPanel.fireEvent('doNextStep', {});
                            outPanel.hadUpLoadPanelCount = 0;
                        }
                    }
                }
            },
            /**
             * 下一步中需要执行的逻辑
             */
            doNextStep: function () {
                var outPanel = this;
                var centerPanel = outPanel.getComponent('centerPanel');
                var outPanelPanelItemDatas = [];
                //生成pageContent
                for (var i = 0; i < centerPanel.items.items.length; i++) {
                    var items = centerPanel.items.items[i];
                    var materialViewTypes = outPanel.productInstance.libraries.materialViewTypes;
                    var materialViewTypeId = items.photoData.materialViewTypeId;
                    var materialViewType = null;
                    var pageContentSchemas = outPanel.productInstance.libraries.pageContentSchemas;
                    var pageContentSchemaId = null;
                    var pageContentSchema = null;
                    var files = items.photoData.files;
                    var productMaterialViewType = {
                        productMaterialViewTypeId: items.productMaterialViewType.productMaterialViewTypeId,
                        _id: items.productMaterialViewType._id
                    };
                    for (var j = 0; j < materialViewTypes.length; j++) {
                        if (materialViewTypeId == materialViewTypes[j]._id) {
                            materialViewType = materialViewTypes[j];
                            pageContentSchemaId = materialViewTypes[j].pageContentSchema._id;
                        }
                    }
                    for (var j = 0; j < pageContentSchemas.length; j++) {
                        if (pageContentSchemaId == pageContentSchemas[j]._id) {
                            pageContentSchema = pageContentSchemas[j];
                        }
                    }
                    var pageContents = outPanel.controller.createPageContent(pageContentSchema, files);
                    if (pageContents.length == 0) {
                        break;
                    }
                    outPanelPanelItemDatas.push({
                        pageContentArr: pageContents,
                        materialViewType: materialViewType,
                        productMaterialViewType: productMaterialViewType,
                        files: files,
                        width: items.photoData.width,
                        height: items.photoData.height
                    })
                }
                if (outPanelPanelItemDatas.length != centerPanel.items.items.length) {
                    Ext.Msg.alert(i18n.getKey('prompt'), '生成pageContent失败');
                    outPanel.el.unmask();
                    return;
                }
                //组成productInstance
                var productInstance = outPanel.controller.buildProductInstance(outPanelPanelItemDatas, outPanel);
                if (Ext.isEmpty(productInstance)) {
                    Ext.Msg.alert(i18n.getKey('prompt'), '生成productInstance失败');
                    outPanel.el.unmask();
                    return;
                }
                //返回结果
                outPanel.el.unmask();
                if (productInstance) {
                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('modifySuccess'), function () {
                        outPanel.record.set('productInstanceId', productInstance._id);
                        console.log(productInstance);
                        outPanel.ownerCt.close();
                    })
                } else {
                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('创建产品实例失败'));
                }

            }
        };
        me.callParent();

    }
})
