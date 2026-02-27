Ext.define('CGP.product.edit.component.skuproducts.OptionTypes', {
    extend: 'Ext.grid.Panel',
    bodyStyle: 'border-color:silver',
    header: {
        style: 'background-color:white;',
        color: 'black',
        border: false
    },
    config: {
        plugins: [Ext.create('Ext.grid.plugin.RowEditing', {
            clicksToEdit: 2
        })],
        height: 300,
        multiSelect: true,
        selType: 'checkboxmodel'
    },

    constructor: function (config) {
        var me = this;




        config = config || {};
        me.callParent([config]);
    },


    initComponent: function () {
        var me = this;

        me.title = '<font color=green>' + i18n.getKey('skuTypes') + '</font>';
        me.width = "100%";
        me.initColumns();
        me.callParent(arguments);
        me.addDocked({
            xtype: 'toolbar',
            dock: 'top',
            items: ['->',{
                xtype: 'button',
                text: i18n.getKey('create'),
                handler: function () {
                    me.batchCreateSkuProduct(me);
                }
            }]
        });

        //先隐藏
        me.setVisible(false);
    },


    initColumns: function () {
        var me = this;

        var columns = [];
        var fields = [];
        me.addSkuAttributeColums(columns,fields);

        columns.push({
            dataIndex: 'sku',
            text: i18n.getKey('sku'),
            width: 200,
            editor: {
                xtype: 'textfield',
                allowBlank: false
            }
        });

        columns.push({
            dataIndex: 'salePrice',
            text: i18n.getKey('salePrice'),
            editor: {
                xtype: 'numberfield',
                allowBlank: false
            }
        });

        columns.push({
            dataIndex: 'weight',
            text: i18n.getKey('weight'),
            editor: {
                xtype: 'numberfield',
                allowBlank: false
            }
        })

        me.store = new Ext.data.Store({
            fields: fields
        });
        me.columns = columns;
    },

    addSkuAttributeColums: function (columns,fields) {
        var me = this;
        var skuAttributeIds = me.skuAttributeIds;
        var attributes = me.attributes;
        Ext.Array.each(skuAttributeIds, function (skuAttributeId) {
            var attribute = attributes.getById(skuAttributeId);
            var options = attribute.get('options');
            var code = attribute.get('code');
            var name = attribute.get('name');
            fields.push(code);
            columns.push({
                dataIndex: code,
                text: name,
                renderer: function (value, metadata, record, rowIndex) {
                    //多个value使用，分开
                    var strValue = [];
                    Ext.Array.each(Ext.String.splitWords(value, ','), function (v) {
                        Ext.Array.each(options, function (option) {
                            if (option['id'] == v) {
                                strValue.push(option['name']);
                            }
                        })
                    });

                    return strValue.join(',');
                }
            });
        });
        //add sku,salePrice,weight to new sku product
        fields.push('sku');
        fields.push('salePrice');
        fields.push('weight');
    },

    /**批量创建sku产品*/
    batchCreateSkuProduct: function (me) {
        var models = me.getSelectionModel().getSelection();
        var datas = [];
        Ext.Array.each(models, function (model) {
            datas.push(model.data);
        })
        var requestParam = {
            method: 'POST',
            url: adminPath + 'api/products/configurable/' + me.configurableProductId + '/skuProduct',
            params: {
                access_token: Ext.util.Cookies.get('token')
            },
            jsonData: datas,
            success: function (resp, options) {

                var response = Ext.JSON.decode(resp.responseText);
                if (response.success) {
                    me.getStore().remove(models);
                    me.skuProductStore.loadData(response.data, true);
                    Ext.Msg.alert("Info", 'Save succeed!');
                    me.window.close();
                    //sku保存成功之后  将返回的product数据
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                }

            },
            failure: function (resp, optoins) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        }

        Ext.Ajax.request(requestParam);

    }
})