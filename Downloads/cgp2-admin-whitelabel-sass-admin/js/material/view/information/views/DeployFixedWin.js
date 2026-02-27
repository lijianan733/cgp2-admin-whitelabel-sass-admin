Ext.Loader.syncRequire([
    'CGP.material.model.Material',
    'CGP.common.field.MaterialSelectField'
])
Ext.define('CGP.material.view.information.views.DeployFixedWin', {
    extend: 'Ext.window.Window',
    modal: true,
    width: 450,
    height: 150,
    layout: 'fit',
    initComponent: function () {
        var me = this;
        var controller = Ext.create('CGP.material.controller.Controller');
        var materialArray = me.record.get('optionalMaterials') ? me.record.get('optionalMaterials') : [];
        materialArray.push(me.record.get('itemMaterial'));
        var materialArrayId = [];
        for (var i = 0; i < materialArray.length; i++) {
            materialArrayId.push(materialArray[i]._id);
        }
        me.title = i18n.getKey('deployFixed');
        var store = Ext.create('Ext.ux.data.store.UxTreeStore', {
            root: 'root',
            model: 'CGP.material.model.Material',
            nodeParam: '_id',
            proxy: {
                type: 'uxmixtreerest',
                url: adminPath + "api/materials/treeNodes",
                headers: {
                    Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                },
                reader: {
                    type: 'json',
                    root: 'data'
                },
                anotherUrl: adminPath + 'api/materials/{id}/childNodes',
                extraParams: {
                    filter: Ext.JSON.encode([
                        {
                            name: 'includeIds',
                            type: 'string',
                            value: materialArrayId
                        }
                    ])
                },
                anotherFilter: {
                    filter: Ext.JSON.encode([
                        {
                            name: 'clazz',
                            type: 'string',
                            value: 'com.qpp.cgp.domain.bom.MaterialSpu'
                        }
                    ])
                }
            }
        });
        me.items = [
            {
                xtype: 'form',
                border: false,
                layout: {
                    type: 'vbox',
                    align: 'center',
                    pack: 'center'
                },
                items: [
                    {
                        xtype: 'materialselectfield',
                        fieldLabel: i18n.getKey('itemMaterial'),
                        itemId: 'displayMaterial',
                        name: 'displayMaterial',
                        store: store,
                        allowBlank: false,
                        hideTopBar: true,
                        width: 350,
                        treeWidth: 450,
                        vtype: 'onlySMU',
                    }
                ]
            }
        ];
        me.bbar = [
            '->',
            {
                xtype: 'button',
                text: i18n.getKey('confirm'),
                handler: function (comp) {
                    var form = me.down('form');
                    if (form.isValid()) {
                        me.store.removeAt(me.rowIndex);
                        var gridStore;
                        var newRecord = me.record.data;
                        newRecord.sourceBomItemId = me.record.getId();
                        delete newRecord.optionalMaterials;
                        newRecord.clazz = 'com.qpp.cgp.domain.bom.bomitem.FixedBOMItem';
                        newRecord.itemMaterial = {
                            _id: form.getComponent('displayMaterial').getValue(),
                            clazz: domainObj.MaterialSpu,
                            idReference: 'Material'
                        };

                        var FixedBOMItemGridStore = Ext.data.StoreManager.getByKey('FixedBOMItemGridStore');
                        if (Ext.isEmpty(FixedBOMItemGridStore)) {
                            gridStore = me.store;
                        } else {
                            gridStore = FixedBOMItemGridStore;
                        }
                        Ext.Ajax.request({
                            url: adminPath + 'common/key',
                            method: 'GET',
                            success: function (res) {
                                var responseMessage = Ext.JSON.decode(res.responseText);
                                if (!responseMessage.success) {
                                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                    return;
                                }
                                var bomItemId = responseMessage.data;
                                var bomItemIdStr = bomItemId.toString();
                                newRecord._id = bomItemIdStr;
                                gridStore.add(newRecord);
                                me.close();
                            },
                            failure: function (resp) {
                                var response = Ext.JSON.decode(resp.responseText);
                                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                            }
                        });
                    }
                }
            },
            {
                xtype: 'button',
                text: i18n.getKey('cancel'),
                handler: function (comp) {
                    comp.ownerCt.ownerCt.close();
                }
            }];
        me.callParent(arguments);
    }

});