/**
 * Created by nan on 2019/1/15.
 */
Ext.define('CGP.product.view.bothwayattributemapping.controller.Controller', {
    /**
     * 设置EditItemTabPanel中的值
     * @param record
     * @param itemsGrid
     */
    rightLoadData: function (record, outTab, skuAttributes, productId) {
        var title = i18n.getKey('create') + i18n.getKey('mappingRelation');
        var editItemTab = outTab.getComponent('editItemTabPanel');
        if (record) {
            title = '<' + record._id + '>' + i18n.getKey('edit') + i18n.getKey('mappingRelation')
        }
        if (editItemTab) {
            outTab.remove('editItemTabPanel');
        }
        var editItemTabPanel = Ext.create('CGP.product.view.bothwayattributemapping.view.EditItemTabPanel', {
            title: title,
            itemId: 'editItemTabPanel',
            recordData: record,
            skuAttributes: skuAttributes,
            outTab: outTab,
            productId: productId
        });
        outTab.add([editItemTabPanel]);
        outTab.setActiveTab(editItemTabPanel);
    },
//    rightLoadData: function (record,outTab,skuAttributes,productId) {
//        var title=i18n.getKey('create') + i18n.getKey('mappingRelation');
//        var editItemTab=outTab.getComponent('editItemTabPanel');
//        if(record){
//            title='<'+record._id+'>'+i18n.getKey('edit') + i18n.getKey('mappingRelation')
//        }
//        if(editItemTab){
//            var editItemTabPanel=outTab.getComponent('editItemTabPanel');
//            editItemTabPanel.setTitle(title);
//            editItemTabPanel.setValue(null);
//            editItemTabPanel.setValue(record);
//        }
//        if(Ext.isEmpty(editItemTab)){
//            //outTab.remove('editItemTabPanel');
//            var editItemTabPanel = Ext.create('CGP.product.view.bothwayattributemapping.view.EditItemTabPanel', {
//                title: title,
//                itemId: 'editItemTabPanel',
//                recordData: record,
//                skuAttributes:skuAttributes,
//                outTab: outTab,
//                productId: productId
//            });
//            outTab.add([editItemTabPanel]);
//            outTab.setActiveTab(editItemTabPanel);
//        }
//    },
    /**
     *  报错配置
     * @param form
     */
    saveItemValue: function (form) {
        var editItemTab = form.ownerCt;
        var leftNavigateGrid = editItemTab.ownerCt.ownerCt.getComponent('leftNavigateGrid');
        var data = form.getValue();
        var attDtoContriller = Ext.create('CGP.product.controller.AttributePropertyDtoTransformController');
        data['attributeMappingDomain'] = attDtoContriller.dealTwoWayAttributeMapping(data);

        var recordId = data._id;
        var mask = new Ext.LoadMask(editItemTab, {
            msg: "加载中..."
        });
        mask.show();
        var method = 'POST';
        var url = adminPath + 'api/twoWayProductAttributeMappings';

        if (recordId) {
            method = 'PUT';
            url = adminPath + 'api/twoWayProductAttributeMappings/' + recordId;
        } else {
            data._id = JSGetCommonKey();
        }
        Ext.Ajax.request({
            url: url,
            method: method,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            jsonData: data,
            success: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('saveSuccess'), function () {
                        leftNavigateGrid.store.load({
                            callback: function (r, options, success) {
                                if (success) {
                                    var currRecord = Ext.Array.findBy(r, function (item) {
                                        return item.get('_id') == responseMessage.data._id;
                                    });
                                    leftNavigateGrid.getSelectionModel().select(currRecord);
                                    form.recordData = responseMessage.data;
                                    form.setTitle('<' + responseMessage.data._id + '>' + i18n.getKey('edit') + i18n.getKey('mappingRelation'));
                                }

                            }
                        });
                    });
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
                mask.hide();
            },
            failure: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                mask.hide();
            }
        });
    },

    deleteRecord: function (id) {
        var method = 'DELETE';
        var url = adminPath + 'api/twoWayProductAttributeMappings/' + id;
        Ext.Ajax.request({
            url: url,
            method: method,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {

                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
            },
            failure: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                //mask.hide();
            }
        });
    }
})
