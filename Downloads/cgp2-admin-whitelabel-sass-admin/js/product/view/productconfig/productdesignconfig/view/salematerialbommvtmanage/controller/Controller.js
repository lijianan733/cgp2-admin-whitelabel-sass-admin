Ext.Loader.syncRequire(['CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.model.ProductMaterialViewTypeVersionFiveModel']);
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.salematerialbommvtmanage.controller.Controller', {
    /**
     * 新增一个产品物料viewType
     * @param {Object} data 新增或修改的数据
     * @param {Ext.window.Window} tabPanel 编辑窗口
     * @param {store} store
     */
    addProductMaterialViewType: function (data, tabPanel, store) {
        data.productMaterialViewTypeId = data.productMaterialViewTypeId.toString();
        Ext.Ajax.request({
            url: adminPath + 'api/productMaterialViewTypes',
            method: 'POST',
            jsonData: data,
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                var success = response.success;
                if (success) {
                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('saveSuccess'), function () {
                        tabPanel.setValue(response.data);
                        store.load();
                        var title = i18n.getKey('edit') + i18n.getKey('pmvt');
                        tabPanel.setTitle(title);
                    });
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                }
            },
            failure: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        })

    },
    /**
     *修改产品viewType
     * @param {Object} data 新增或修改的数据
     * @param {Ext.window.Window} tabPanel 编辑窗口
     */
    updateProductMaterialViewType: function (data, tabPanel) {
        Ext.Ajax.request({
            url: adminPath + 'api/productMaterialViewTypes/' + data['_id'],
            method: 'PUT',
            jsonData: data,
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                var success = response.success;
                if (success) {
                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('modifySuccess'));

                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                }
            },
            failure: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        })
    },
    /**
     * 删除产品物料ViewType
     * @param {Number} productMaterialViewTypeID
     * @param {Ext.data.Store} store 产品物料viewType store
     */
    deleteProductMaterialViewType: function (productMaterialViewTypeID, store) {
        Ext.Msg.confirm('提示', '是否删除？', callback);

        function callback(id) {
            if (id === 'yes') {
                Ext.Ajax.request({
                    url: adminPath + 'api/productMaterialViewTypes/' + productMaterialViewTypeID,
                    method: 'DELETE',
                    headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                    success: function (resp) {
                        var response = Ext.JSON.decode(resp.responseText);
                        var success = response.success;
                        if (success) {
                            store.load();
                        } else {
                            Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                        }
                    },
                    failure: function (resp) {
                        var response = Ext.JSON.decode(resp.responseText);
                        Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                    }
                })
            }
        }
    },
    editPmvt: function (topTab, editOrNew, recordId, productBomConfigId, productConfigDesignId, store, materialPath, schemaVersion) {
        var me = this;
        var tab = topTab.getComponent('editPmvt');
        if (tab != null) {
            topTab.remove(tab);
        }
        tab = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.salematerialbommvtmanage.view.EditPmvt', {
            recordId: recordId,
            editOrNew: editOrNew,
            schemaVersion: schemaVersion,
            itemId: 'editPmvt',
            materialPath: materialPath,
            productBomConfigId: productBomConfigId,
            productConfigDesignId: productConfigDesignId,
            store: store,
            closable: true
        });
        topTab.add(tab);
        if (recordId) {
            CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.model.ProductMaterialViewTypeVersionFiveModel.load(recordId, {
                scope: this,
                failure: function (record, operation) {
                    //do something if the load failed
                },
                success: function (record, operation) {
                    console.log(record.getData());
                    tab.setValue(record.getData());
                    //do something if the load succeeded
                },
                callback: function (record, operation) {
                    //do something whether the load succeeded or failed
                }
            })
        }
        topTab.setActiveTab(tab);
    }
})
