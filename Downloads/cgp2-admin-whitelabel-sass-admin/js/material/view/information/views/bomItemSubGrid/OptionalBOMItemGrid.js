Ext.define("CGP.material.view.information.views.bomItemSubGrid.OptionalBOMItemGrid", {
    extend: "CGP.material.view.information.views.bomItemSubGrid.BomItemSupGrid",
    constructor: function (config) {
        var me = this;
        me.store = config.gridstore;
        me.setVisible(me.store.getCount());
        me.title = i18n.getKey('bomItem');
        var controller = Ext.create('CGP.material.controller.Controller');
        me.callParent(arguments)
    },
    initComponent: function () {
        var me = this;
        me.columns = Ext.Array.merge(me.columns, [
            {
                dataIndex: 'optionalMaterials',
                text: i18n.getKey('optionalMaterials'),
                flex: 1,
                sortable: false,
                tdCls: 'vertical-middle',
                itemId: 'optionalMaterials',
                renderer: function (v, record) {
                    var valueStr = '';
                    if (!Ext.isEmpty(v)) {
                        Ext.Array.each(v, function (item, index) {
                            var parentId = '';
                            var material = {};
                            Ext.Ajax.request({
                                url: adminPath + 'api/materials/' + item['_id'],
                                method: 'GET',
                                async: false,
                                params: {
                                    page: 1,
                                    limit: 10
                                },
                                headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                                success: function (res) {
                                    var responseMessage = Ext.JSON.decode(res.responseText);
                                    material = responseMessage.data;
                                    parentId = '';
                                    if (material.parentMaterialType) {
                                        parentId = material.parentMaterialType['_id'];
                                    }
                                    if (responseMessage.success) {
                                        var value = '<a style="text-decoration: none;" onclick="javascript:controller.checkMaterial(' + material['_id'] + ')" href="#">' + material.name + '<' + material['_id'] + '>' + '</a>' + ',';
                                        if (index / 2 > 0 && index % 2 == 0) {
                                            valueStr += '<br>' + value;
                                        } else {
                                            valueStr += value;
                                        }
                                    } else {
                                        Ext.Msg.alert('提示', '请求错误：' + responseMessage.data.message)
                                        return;
                                    }

                                },
                                failure: function (resp) {
                                    var response = Ext.JSON.decode(resp.responseText);
                                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                                    return;
                                }
                            });
                        });
                    }
                    return valueStr;
                }
            }
        ]);
        me.callParent(arguments);
        /*        me.content = me;
         window.controller = controller;*/
    }

})