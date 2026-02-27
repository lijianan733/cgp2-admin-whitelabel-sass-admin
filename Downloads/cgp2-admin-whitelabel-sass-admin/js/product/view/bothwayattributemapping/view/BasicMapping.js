/**
 * Created by admin on 2019/12/17.
 */
Ext.define('CGP.product.view.bothwayattributemapping.view.BasicMapping', {
    extend: 'CGP.product.view.managerskuattribute.skuattributeconstrainterversion2.view.DiyFieldSet',
    alias: 'widget.basicMappingfieldSet',
    productId: null,
    mappingLinkExcludes: null,
    mappingExcludes: null,
    depends: null,
    initComponent: function () {
        var me = this;
        me.mappingLinkExcludes = [];
        me.mappingExcludes = [];
        me.depends = [];
        var mappingLinkStore = me.mappingLinkStore = Ext.create('CGP.product.view.mappinglink.store.MappingLinkStore', {
            storeId: 'mappingLinkStore',
            pageSize: 10,
            params: {
                filter: Ext.JSON.encode([{
                    name: 'productId',
                    type: 'number',
                    value: Ext.Number.from(me.productId, 0)
                }, {
                    name: 'excludeIds',
                    type: 'array',
                    value: me.mappingLinkExcludes ? me.mappingLinkExcludes : []
                }])
            }
        });
        var allProductAttributeMappingStore = Ext.create('CGP.product.store.ProductAttributeMapping', {
            storeId: 'allProductAttributeMappingStore',
            pageSize: 10,
            params: {
                filter: Ext.JSON.encode([{
                    name: 'productId',
                    type: 'number',
                    value: Ext.Number.from(me.productId, 0)
                }, {
                    name: 'excludeIds',
                    type: 'string',
                    value: me.mappingExcludes.length > 0 ? me.mappingExcludes.toString() : []
                }])
            }
        });
        me.items = [
            {
                xtype: 'fieldcontainer',
                itemId: 'basicContainer',
                layout: {
                    type: 'vbox'
                },
                items: [
                    {
                        xtype: 'gridcombo',
                        itemId: 'mappingLinks',
                        name: "mappingLinks",
                        fieldLabel: i18n.getKey('mappingLinks'),
                        displayField: 'linkName',
                        valueField: '_id',
                        store: mappingLinkStore,
                        allowBlank: false,
                        multiSelect: true,
                        autoScroll: true,
                        editable: false,
                        haveReset: true,
                        width: 530,
                        id: 'mappingLinks',
                        gridCfg: {
                            store: mappingLinkStore,
                            maxHeight: 200,
                            autoScroll: true,
                            selType: 'checkboxmodel',
                            //hideHeaders : true,
                            columns: [
                                {
                                    text: i18n.getKey('id'),
                                    width: 80,
                                    dataIndex: '_id',
                                    renderer: function (value, metaData) {
                                        metaData.tdAttr = 'data-qtip="' + "<div>" + value + "</div>" + '"';
                                        return value;
                                    }
                                },
                                {
                                    text: i18n.getKey('linkName'),
                                    dataIndex: 'linkName',
                                    flex: 1
                                }
                            ],
                            bbar: Ext.create('Ext.PagingToolbar', {
                                store: mappingLinkStore,
                                emptyMsg: i18n.getKey('noData')
                            })
                        },
                        listeners: {
                            change: function (gridcombo, newValue, oldValue) {
                                var fieldset = gridcombo.ownerCt.ownerCt;
                                var oldDepends = [];
                                for (var i = 0; i < fieldset.depends.length; i++) {
                                    oldDepends.push(fieldset.depends[i]._id);

                                }
                                var depends = gridcombo.ownerCt.getComponent('depends');
                                var dependIds = Object.keys(depends.getValue());
                                if (oldDepends.length > 0) {
                                    dependIds = oldDepends;
                                }
                                var filter = Ext.JSON.decode(allProductAttributeMappingStore.params.filter);
                                filter[2] = {
                                    name: "mappingLinkIds",
                                    value: Object.keys(newValue).toString(),
                                    type: "string"
                                };
                                allProductAttributeMappingStore.params.filter = Ext.JSON.encode(filter);
                                allProductAttributeMappingStore.loadPage(1, {
                                    callback: function (records) {
                                        if (records.length > 0) {
                                            depends.setDisabled(false);
                                            oldDepends = [];
                                            fieldset.depends = [];
                                            if (dependIds.length > 0) {
                                                var url = adminPath + 'api/productAttributeMappings?page=1&start=0&limit=100';
                                                filter[3] = {
                                                    name: "includeIds",
                                                    type: "string",
                                                    value: dependIds.toString()
                                                };
                                                url = url + '&filter=' + Ext.JSON.encode(filter);
                                                Ext.Ajax.request({
                                                    url: encodeURI(url),
                                                    method: 'GET',
                                                    headers: {
                                                        Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                                                    },
                                                    success: function (response) {
                                                        var responseMessage = Ext.JSON.decode(response.responseText);
                                                        if (responseMessage.success) {
                                                            depends.setValue(responseMessage.data.content);
                                                        } else {
                                                            Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                                        }
                                                    },
                                                    failure: function (response) {
                                                        var responseMessage = Ext.JSON.decode(response.responseText);
                                                        Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                                    }
                                                });
                                            }
                                        } else {
                                            depends.setValue();
                                            depends.setDisabled(true);
                                        }
                                    }
                                });
                                //
                                var entryLink = Ext.getCmp('entryLink');
                                if(entryLink){
                                    if (Object.keys(newValue).length > 0) {
                                        entryLink.setDisabled(false);
                                    } else {
                                        entryLink.setDisabled(true);
                                    }
                                }
                            }
                        }
                    },
                    {
                        xtype: 'gridcombo',
                        itemId: 'depends',
                        name: "depends",
                        disabled: true,
                        fieldLabel: i18n.getKey('depends'),
                        displayField: 'description',
                        valueField: '_id',
                        store: allProductAttributeMappingStore,
                        //matchFieldWidth: false,
                        multiSelect: true,
                        autoScroll: true,
                        editable: false,
                        haveReset: true,
                        width: 530,
                        isHiddenCheckSelected: false,
                        gridCfg: {
                            maxHeight: 200,
                            autoScroll: true,
                            selType: 'checkboxmodel',
                            //hideHeaders : true,
                            columns: [
                                {
                                    text: i18n.getKey('id'),
                                    width: 80,
                                    dataIndex: '_id',
                                    renderer: function (value, metaData) {
                                        metaData.tdAttr = 'data-qtip="' + "<div>" + value + "</div>" + '"';
                                        return value;
                                    }
                                },
                                {
                                    text: i18n.getKey('name'),
                                    dataIndex: 'description',
                                    flex: 1
                                }
                            ],
                            bbar: Ext.create('Ext.PagingToolbar', {
                                store: allProductAttributeMappingStore,
                                /*
                                 displayInfo: true,  //是否显示，分页信息
                                 */
                                /*
                                 displayMsg: 'Displaying {0} - {1} of {2}', //显示的分页信息
                                 */
                                emptyMsg: i18n.getKey('noData')
                            })
                        }
                    }
                ]
            }
        ];
        me.callParent(arguments);
    },
    setParentData: function (data) {
        var me = this;
        var items = me.getComponent('basicContainer').items.items;
        Ext.Array.each(items, function (item) {
            var values = item.getValue(), result = [];
            if (values) {
                for (var key in values) {
                    var idReference = {};
                    if (key != 'undefined' && values[key]) {
                        idReference = {
                            clazz: values[key].clazz,
                            idReference: values[key].clazz.substring(values[key].clazz.lastIndexOf('.') + 1),
                            _id: values[key]._id
                        };
                        if (item.itemId == 'depends' && values[key].attributeMappingDomain) {
                            idReference.attributeMappingDomain = {
                                clazz: values[key].attributeMappingDomain.clazz,
                                idReference: values[key].attributeMappingDomain.clazz.substring(values[key].clazz.lastIndexOf('.') + 1),
                                _id: values[key].attributeMappingDomain._id
                            }
                        }
                        result.push(idReference);
                    }
                }
            }
            data[item.name] = result;
        })
    },
    setValue: function (data) {
        var me = this;
        me.depends = data.depends || [];
        var items = me.getComponent('basicContainer').items.items;

        Ext.Array.each(items, function (item) {
            if (data && !Ext.isEmpty(data[item.name])) {
                if (item.getName() == 'depends') {

                } else {
                    item.setInitialValue(data[item.name].map(function (val) {
                        return val ? val._id : '0';
                    }));
                }
            } else {
                item.setValue('');
            }
        })


    },
    isValid:function(){
        var me = this;
        var items = me.getComponent('basicContainer').items.items;;
        var isValid = true;
        items.forEach(function (item) {
            if (item.rendered) {
                if (item.isValid() == false) {
                    isValid = false;
                }
            }
        });
        return isValid;
    }
})
