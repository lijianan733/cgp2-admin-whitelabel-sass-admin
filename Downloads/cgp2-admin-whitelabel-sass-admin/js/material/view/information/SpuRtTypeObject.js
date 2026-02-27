Ext.Loader.syncRequire([
    'CGP.common.field.RtTypeSelectField'
])
Ext.define("CGP.material.view.information.SpuRtTypeObject", {
    extend: "Ext.tree.Panel",
    width: 600,
    height: 500,
    collapsible: true,
    config: {
        rootVisible: false,
        useArrows: true,
        viewConfig: {
            stripeRows: true,
            selectedItemCls: '',
            focusedItemCls: '',
            overItemCls: ''
        }
    },
    autoScroll: true,
    children: null,
    selModel: {
        selType: 'rowmodel'
    },
    itemId: 'spuRtTypeObject',
    rootNode: 'root',//标识根的位置
    initComponent: function () {
        var me = this;
        me.title = i18n.getKey('spuAttribute');

        me.store = Ext.create('CGP.material.store.RtAttributeTree', {
            root: {
                _id: "root"
            }
        });
        me.store.proxy.url = adminPath + 'api/rtTypes/root/rtAttributeDefs';
        me.store.on('load', function (store, node, records) {
            Ext.Array.each(records, function (item) {
                //console.log(node);
                if (node.isRoot()) {
                    if (item.get('valueType') == 'CustomType') {
                        me.valueJsonObject[item.get('name')] = {};
                    } else {
                        if (!Ext.isEmpty(me.objectJson)) {
                            if (!Ext.isEmpty(me.objectJson[item.get('name')])) {
                                me.valueJsonObject[item.get('name')] = me.objectJson[item.get('name')]
                            } else {
                                me.valueJsonObject[item.get('name')] = null
                            }
                        }
                    }
                } else {
                    var path = node.getPath('name');
                    var array = path.split('/');
                    var valuePath = '$';
                    Ext.Array.each(array, function (item) {
                        if (!Ext.isEmpty(item)) {
                            valuePath += '.' + item;
                        }
                    });
                    if (item.get('valueType') == 'CustomType') {
                        jsonPath(me.valueJsonObject, valuePath)[0][item.get('name')] = {};
                    } else {
                        if (jsonPath(me.objectJson, valuePath)) {
                            jsonPath(me.valueJsonObject, valuePath)[0][item.get('name')] = jsonPath(me.objectJson, valuePath)[0][item.get('name')]
                        } else {
                            jsonPath(me.valueJsonObject, valuePath)[0][item.get('name')] = null
                        }
                    }
                }
            });
            Ext.each(records, function (item) {
                if ('root' != item.data._id) {
                    item.setId(item.data.parentId + '-' + item.data._id);
                    item.commit();
                }
            });
            Ext.Array.each(records, function (item) {
                if (me.data.type == 'MaterialType') {
                    var path = item.getPath('name');
                    var array = path.split('/');
                    var valuePath = '$';
                    Ext.Array.each(array, function (item) {
                        if (!Ext.isEmpty(item)) {
                            valuePath += '.' + item;
                        }
                    });
                    if (me.objectJson) {
                        if (jsonPath(me.objectJson, valuePath)[0]) {
                            item.set('checked', true)
                        } else {
                            item.set('checked', false)
                        }
                    } else {
                        item.set('checked', false)
                    }
                    //item.set('checked',true)
                }
                //item.set('checked',true)
            });
            //me.getSelectionModel().selectAll();
        });
        me.columns = [
            {
                xtype: 'treecolumn',
                text: i18n.getKey('name'),
                //tdCls: 'vertical-middle',
                width: 200,
                dataIndex: 'name'
            },
            {
                text: i18n.getKey('value'),
                xtype: 'componentcolumn',
                width: 350,
                //dataIndex: 'value',
                listeners: {
                    beforerender: function (comp) {
                        //console.log(comp);
                        //return false;
                    }
                },
                renderer: function (value, metadata, record, a, b, c, view) {

//                    if(record.get('value')){
//                        return false;
//                    }
                    var valueType = record.get('valueType');
                    var selectType = record.get('selectType');
                    var options = record.get('options');
                    var array = record.getPath('name').split('/');
                    var valuePath = '$';
                    Ext.Array.each(array, function (item) {
                        if (!Ext.isEmpty(item)) {
                            valuePath += '.' + item;
                        }
                    });
                    var comp;
                    switch (selectType) {
                        case 'NON':
                            if (Ext.Array.contains(['String', 'Date'], valueType)) {
                                comp = {
                                    xtype: 'textfield',
                                    id: record.getId(),
                                    msgTarget: 'side',
                                    disabled: record.get('checked') == null ? false : !record.get('checked'),
                                    allowBlank: false,
                                    listeners: {
                                        change: function (comp, newValue, oldValue) {
                                            var array = record.getPath('name').split('/');
                                            var value = me.valueJsonObject;
                                            for (var i = 0; i < array.length; i++) {
                                                if (!Ext.isEmpty(array[i])) {

                                                    if (i == array.length - 1) {
                                                        if (Ext.isEmpty(newValue)) {
                                                            value[array[i]] = null;
                                                        } else {
                                                            value[array[i]] = newValue;
                                                        }
                                                        //me.objectJson = me.valueJsonObject;
                                                    } else {
                                                        value = value[array[i]];
                                                        me.objectJson = me.valueJsonObject;
                                                    }
                                                }
                                            }
                                        },
                                        afterrender: function (comp) {
                                            if (me.objectJson) {
                                                comp.setValue(jsonPath(me.objectJson, valuePath)[0]);
                                            }
                                        }
                                    }
                                }

                            } else if (Ext.Array.contains(['Number', 'int'], valueType)) {
                                comp = {
                                    xtype: 'numberfield',
                                    msgTarget: 'side',
                                    decimalPrecision: 8,
                                    disabled: record.get('checked') == null ? false : !record.get('checked'),
                                    allowBlank: false,
                                    id: record.getId(),
                                    listeners: {
                                        change: function (comp, newValue, oldValue) {
                                            var array = record.getPath('name').split('/');
                                            var value = me.valueJsonObject;
                                            for (var i = 0; i < array.length; i++) {
                                                if (!Ext.isEmpty(array[i])) {

                                                    if (i == array.length - 1) {
                                                        if (Ext.isEmpty(newValue)) {
                                                            value[array[i]] = null;
                                                        } else {
                                                            value[array[i]] = newValue;
                                                        }
                                                        //me.objectJson = me.valueJsonObject;
                                                    } else {
                                                        value = value[array[i]];
                                                        me.objectJson = me.valueJsonObject;
                                                    }
                                                }
                                            }
                                        },
                                        afterrender: function (comp) {
                                            if (me.objectJson) {
                                                comp.setValue(jsonPath(me.objectJson, valuePath)[0]);
                                            }
                                        }
                                    }
                                }

                            } else if (valueType === 'Boolean') {
                                comp = {
                                    xtype: 'combo',
                                    displayField: 'name',
                                    valueField: 'value',
                                    disabled: record.get('checked') == null ? false : !record.get('checked'),
                                    msgTarget: 'side',
                                    id: record.getId(),
                                    allowBlank: false,
                                    editable: false,
                                    listeners: {
                                        change: function (comp, newValue, oldValue) {
                                            var array = record.getPath('name').split('/');
                                            var value = me.valueJsonObject;
                                            for (var i = 0; i < array.length; i++) {
                                                if (!Ext.isEmpty(array[i])) {

                                                    if (i == array.length - 1) {
                                                        if (Ext.isEmpty(newValue)) {
                                                            value[array[i]] = null;
                                                        } else {
                                                            value[array[i]] = newValue;
                                                        }
                                                        //me.objectJson = me.valueJsonObject;
                                                    } else {
                                                        value = value[array[i]];
                                                        me.objectJson = me.valueJsonObject;
                                                    }
                                                }
                                            }
                                        },
                                        afterrender: function (comp) {
                                            if (me.objectJson) {
                                                comp.setValue(jsonPath(me.objectJson, valuePath)[0]);
                                            }
                                        }
                                    },
                                    store: Ext.create('Ext.data.Store', {
                                        fields: ['name', 'value'],
                                        data: [
                                            {name: 'true', value: true},
                                            {name: 'false', value: false}
                                        ]
                                    }),
                                    queryMode: 'local'
                                }
                            }
                            break;
                        case 'SINGLE':
                            if (Ext.Array.contains(['String', 'Date', 'Number', 'int', 'Boolean'], valueType)) {
                                comp = {
                                    xtype: 'combo',
                                    displayField: 'name',
                                    msgTarget: 'side',
                                    editable: false,
                                    disabled: record.get('checked') == null ? false : !record.get('checked'),
                                    allowBlank: false,
                                    id: record.getId(),
                                    valueField: 'value',
                                    listeners: {
                                        change: function (comp, newValue, oldValue) {
                                            var array = record.getPath('name').split('/');
                                            var value = me.valueJsonObject;
                                            for (var i = 0; i < array.length; i++) {
                                                if (!Ext.isEmpty(array[i])) {

                                                    if (i == array.length - 1) {
                                                        if (Ext.isEmpty(newValue)) {
                                                            value[array[i]] = null;
                                                        } else {
                                                            value[array[i]] = newValue;
                                                        }
                                                        //me.objectJson = me.valueJsonObject;
                                                    } else {
                                                        value = value[array[i]];
                                                        me.objectJson = me.valueJsonObject;
                                                    }
                                                }
                                            }
                                        },
                                        afterrender: function (comp) {
                                            if (me.objectJson) {
                                                comp.setValue(jsonPath(me.objectJson, valuePath)[0]);
                                            }
                                        }
                                    },
                                    store: Ext.create('Ext.data.Store', {
                                        fields: ['name', 'value'],
                                        data: options
                                    }),
                                    queryMode: 'local'
                                }

                            }
                            break;
                        case 'MULTI':
                            if (Ext.Array.contains(['String', 'Date', 'Number', 'int', 'Boolean'], valueType)) {
                                comp = {
                                    xtype: 'combo',
                                    displayField: 'name',
                                    multiSelect: true,
                                    msgTarget: 'side',
                                    editable: false,
                                    disabled: record.get('checked') == null ? false : !record.get('checked'),
                                    id: record.getId(),
                                    allowBlank: false,
                                    valueField: 'value',
                                    listeners: {
                                        change: function (comp, newValue, oldValue) {
                                            var array = record.getPath('name').split('/');
                                            var value = me.valueJsonObject;
                                            for (var i = 0; i < array.length; i++) {
                                                if (!Ext.isEmpty(array[i])) {

                                                    if (i == array.length - 1) {
                                                        if (Ext.isEmpty(newValue)) {
                                                            value[array[i]] = null;
                                                        } else {
                                                            value[array[i]] = newValue;
                                                        }
                                                        //me.objectJson = me.valueJsonObject;
                                                    } else {
                                                        value = value[array[i]];
                                                        me.objectJson = me.valueJsonObject;
                                                    }
                                                }
                                            }
                                        },
                                        afterrender: function (comp) {
                                            if (me.objectJson) {
                                                comp.setValue(jsonPath(me.objectJson, valuePath)[0]);
                                            }
                                        }
                                    },
                                    store: Ext.create('Ext.data.Store', {
                                        fields: ['name', 'value'],
                                        data: options
                                    }),
                                    queryMode: 'local'
                                }

                            }
                            break;
                    }

                    return comp;
                }

            }
        ];

        me.listeners = {
            afterrender: function () {
                me.expandAll();
                me.store.on('load', function () {
                    //me.collapseAll();
                })
            },
            beforeload: function (sto, operation, e) {
                var type = operation.node.get('valueType');
                var rtTypeId;
                var customType = operation.node.get('customType');
                if (customType) {
                    rtTypeId = customType['_id'];
                }
                if (type == 'CustomType') {
                    sto.proxy.url = adminPath + 'api/rtTypes/' + rtTypeId + '/rtAttributeDefs';
                } else {
                    //sto.proxy.url = adminPath + 'api/admin/runtimeType/rtTypes/{id}/rtAttributeDefs';
                }
            },
            checkchange: function (node, newChecked) {
                if (Ext.getCmp(node.getId())) {
                    Ext.getCmp(node.getId()).setDisabled(!newChecked)
                }

                function eachNode(node) {
                    for (var j = 0; j < node.childNodes.length; j++) {
                        if (node.childNodes[j].hasChildNodes()) {
                            eachNode(node.childNodes[j]);
                        }
                        node.childNodes[j].set('checked', newChecked);
                        if (Ext.getCmp(node.childNodes[j].getId())) {
                            Ext.getCmp(node.childNodes[j].getId()).setDisabled(!newChecked)
                        }
                    }
                }

                eachNode(node);

                function eachParentNode(node) {
                    if (node.parentNode) {
                        //eachParentNode(node.parentNode);
                        var isTureArr = [];
                        node.parentNode.eachChild(function (childNode) {
                            if (childNode.get('checked')) {
                                isTureArr.push(childNode);
                            }
                        });
                        if (Ext.isEmpty(isTureArr)) {
                            node.parentNode.set('checked', false);
                            /*if(Ext.getCmp(node.getId())){
                             Ext.getCmp(node.getId()).setDisabled(true)
                             }*/
                            eachParentNode(node.parentNode);
                        } else {
                            node.parentNode.set('checked', true);
                            /*if(Ext.getCmp(node.getId())){
                             Ext.getCmp(node.getId()).setDisabled(false)
                             }*/
                            eachParentNode(node.parentNode);
                        }
                    }
                }

                eachParentNode(node);
            }
        };
        me.tbar = [];
        me.callParent(arguments);

    },
    getValue: function () {
        var me = this;

        var rtTypeId = me.down('toolbar').getComponent('customTypeComp').getValue();
        var spuRtType;
        var SpuRtTypeData = {
            spuRtType: null,
            spuRtTypeRtObject: null,
        };
        if (Ext.isEmpty(rtTypeId)) {
            return SpuRtTypeData;
        }
        var spuRtTypeRtObject = {};
        var jsonHaveNull = false;
        //var rtTypeId = me.getComponent('rtTypeId').getValue();
        var type = me.data.type;
        if (type == 'MaterialSpu') {
            spuRtType = null;
        } else {
            spuRtType = {_id: rtTypeId, idReference: 'RtType', clazz: domainObj['RtType']}
        }
        var jsonValue = {};
        var rootNode = me.getRootNode();
        var arrNeedComp = [];
        var isBlankArr = [];

        function getJsonValue(rootNode) {

            Ext.Array.each(rootNode.childNodes, function (node) {

                //console.log(node);
                if (me.data.type == 'MaterialType') {
                    if (rootNode.isRoot()) {
                        if (node.get('checked')) {
                            if (node.get('valueType') == 'CustomType') {
                                jsonValue[node.get('name')] = {};
                                if (node.hasChildNodes()) {
                                    getJsonValue(node);
                                }
                            } else {
                                jsonValue[node.get('name')] = Ext.getCmp(node.getId()).getValue();
                                arrNeedComp.push(Ext.getCmp(node.getId()));
                            }
                        }
                    } else {
                        var path = node.getPath('name');
                        var array = path.split('/');
                        var valuePath = '$';
                        for (var i = 0; i < array.length; i++) {
                            if (!Ext.isEmpty(array[i])) {
                                if (i != array.length - 1) {
                                    valuePath += '.' + array[i];
                                }
                            }
                        }

                        if (node.get('checked')) {
                            if (node.get('valueType') == 'CustomType') {
                                jsonPath(jsonValue, valuePath)[0][node.get('name')] = {};
                                if (node.hasChildNodes()) {
                                    getJsonValue(node);
                                }
                            } else {
                                jsonPath(jsonValue, valuePath)[0][node.get('name')] = Ext.getCmp(node.getId()).getValue();
                                arrNeedComp.push(Ext.getCmp(node.getId()));
                            }
                        }
                    }
                } else if (me.data.type == 'MaterialSpu') {
                    if (rootNode.isRoot()) {
                        if (node.get('valueType') == 'CustomType') {
                            jsonValue[node.get('name')] = {};
                            if (node.hasChildNodes()) {
                                getJsonValue(node);
                            }
                        } else {
                            jsonValue[node.get('name')] = Ext.getCmp(node.getId()).getValue();
                            arrNeedComp.push(Ext.getCmp(node.getId()));
                        }

                    } else {
                        var path = node.getPath('name');
                        var array = path.split('/');
                        var valuePath = '$';
                        for (var i = 0; i < array.length; i++) {
                            if (!Ext.isEmpty(array[i])) {
                                if (i != array.length - 1) {
                                    valuePath += '.' + array[i];
                                }
                            }
                        }

                        if (node.get('valueType') == 'CustomType') {
                            jsonPath(jsonValue, valuePath)[0][node.get('name')] = {};
                            if (node.hasChildNodes()) {
                                getJsonValue(node);
                            }
                        } else {
                            jsonPath(jsonValue, valuePath)[0][node.get('name')] = Ext.getCmp(node.getId()).getValue();
                            arrNeedComp.push(Ext.getCmp(node.getId()));
                        }
                    }
                }
            });
        }

        getJsonValue(rootNode);
        if (!Ext.isEmpty(arrNeedComp)) {
            Ext.Array.each(arrNeedComp, function (item) {
                if (!item.isValid()) {
                    isBlankArr.push('blank');
                }
            })
        }
        if (me.data.spuRtTypeRtObject) {
            var rtObjectData = {
                "_id": me.data.spuRtTypeRtObject['_id'],
                "clazz": "com.qpp.cgp.domain.bom.runtime.RtObject",
                "idReference": "RtObject",
                "rtType": {
                    "_id": rtTypeId,
                    "idReference": "RtType",
                    "clazz": "com.qpp.cgp.domain.bom.attribute.RtType"
                }
            };
            rtObjectData.objectJSON = jsonValue;
            var rtObjectString = JSON.stringify(rtObjectData);
            Ext.Ajax.request({
                url: adminPath + 'api/bom',
                method: 'POST',
                async: false,
                jsonData: [
                    {
                        "entities": [rtObjectString],
                        "entityName": "RtObject"
                    }
                ],
                headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                success: function (res) {
                    var responseMessage = Ext.JSON.decode(res.responseText);
                    if (!responseMessage.success) {
                        Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                    }
                },
                failure: function (resp) {
                    var response = Ext.JSON.decode(resp.responseText);
                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                }
            });
            SpuRtTypeData.spuRtType = spuRtType;
            if (type == 'MaterialSpu') {
                delete SpuRtTypeData.spuRtType;
            }
            SpuRtTypeData.spuRtTypeRtObject = rtObjectData;
            if (Ext.isEmpty(isBlankArr)) {
                return SpuRtTypeData;
            } else {
                me.ownerCt.setActiveTab(me);
                Ext.Array.each(arrNeedComp, function (item) {
                    item.isValid();
                });
                return true;
            }

        } else {
            if (Ext.isEmpty(rtTypeId)) {
                SpuRtTypeData = {};
                if (Ext.isEmpty(isBlankArr)) {
                    return SpuRtTypeData;
                } else {
                    me.ownerCt.setActiveTab(me);
                    Ext.Array.each(arrNeedComp, function (item) {
                        item.isValid();
                    });
                    return true;
                }
            } else {
                Ext.Ajax.request({
                    url: adminPath + 'common/key',
                    method: 'GET',
                    async: false,
                    success: function (res) {
                        var responseMessage = Ext.JSON.decode(res.responseText);
                        var rtObjectId = responseMessage.data;
                        var rtObjectData = {
                            "_id": rtObjectId.toString(),
                            "clazz": "com.qpp.cgp.domain.bom.runtime.RtObject",
                            "idReference": "RtObject",
                            "rtType": {
                                "_id": rtTypeId,
                                "idReference": "RtType",
                                "clazz": "com.qpp.cgp.domain.bom.attribute.RtType"
                            },
                            "objectJSON": jsonValue
                        };
                        var rtObjectString = JSON.stringify(rtObjectData);
                        Ext.Ajax.request({
                            url: adminPath + 'api/bom',
                            method: 'POST',
                            async: false,
                            jsonData: [
                                {
                                    "entities": [rtObjectString],
                                    "entityName": "RtObject"
                                }
                            ],
                            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                            success: function (res) {
                                var responseMessage = Ext.JSON.decode(res.responseText);
                                if (responseMessage.success) {
                                    SpuRtTypeData.spuRtTypeRtObject = Ext.JSON.decode(responseMessage.data[0].entities[0]);
                                } else {
                                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                }
                            },
                            failure: function (resp) {
                                var response = Ext.JSON.decode(resp.responseText);
                                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                            }
                        })
                    },
                    failure: function (resp) {
                        var response = Ext.JSON.decode(resp.responseText);
                        Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                    }
                });
                SpuRtTypeData.spuRtType = spuRtType;
                if (type == 'MaterialSpu') {
                    delete SpuRtTypeData.spuRtType;
                }
                if (Ext.isEmpty(isBlankArr)) {
                    return SpuRtTypeData;
                } else {
                    me.ownerCt.setActiveTab(me);
                    Ext.Array.each(arrNeedComp, function (item) {
                        item.isValid();
                    });
                    return true;
                }
            }
        }
        /*if (me.data.spuRtTypeRtObject) {
         if (me.data.spuRtTypeRtObject.id) {
         spuRtTypeRtObject = {id: me.data.spuRtTypeRtObject.id, rtTypeId: rtTypeId, objectJSON: jsonValue};
         } else {
         spuRtTypeRtObject = { rtTypeId: rtTypeId, objectJSON: jsonValue};
         }
         } else {
         spuRtTypeRtObject = { rtTypeId: rtTypeId, objectJSON: jsonValue};
         }
         SpuRtTypeData.spuRtType = spuRtType;
         SpuRtTypeData.spuRtTypeRtObject = spuRtTypeRtObject;
         if(Ext.isEmpty(isBlankArr)){
         return SpuRtTypeData;
         }else{
         me.ownerCt.setActiveTab(me);
         Ext.Array.each(arrNeedComp,function(item){
         item.isValid();
         });
         return true;
         }*/

    },
    refreshData: function (data) {
        var me = this;
        if (data.clazz == 'com.qpp.cgp.domain.bom.MaterialType') {
            data.type = 'MaterialType'
        } else if (data.clazz == 'com.qpp.cgp.domain.bom.MaterialSpu') {
            data.type = 'MaterialSpu'
        }
        me.data = data;
        //me.store.load();
        me.valueJsonObject = {};
        me.down('toolbar').removeAll();
        me.down('toolbar').setVisible(true);
        if (data.spuRtTypeRtObject) {
            Ext.Ajax.request({
                url: adminPath + 'api/bom/RtObject/' + data.spuRtTypeRtObject['_id'] + '?includeReferenceEntity=false',
                method: 'GET',
                async: false,
                headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                success: function (res) {
                    var responseMessage = Ext.JSON.decode(res.responseText);
                    if (responseMessage.success) {
                        var objectJSON = responseMessage.data.objectJSON;
                        me.objectJson = objectJSON;
                    } else {
                        Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                    }

                },
                failure: function (resp) {
                    var response = Ext.JSON.decode(resp.responseText);
                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                }
            });
        }
        var rtTypeStore;
        var rtTypeTreeCombo = {
            name: 'customTypeComp',
            xtype: 'rttypeselectfield',
            fieldLabel: i18n.getKey('spuRtType'),
            itemId: 'customTypeComp',
            haveReset: data.leaf,
            width: 450,
            multiselect: false,
/*            reset: function () {
                this.value = undefined;
                this.setRawValue('');
                this.ids = [];
                this.selectedRecords = [];
                this.recordPath = {};
                this.displayStr = [];
                var picker = this.picker;
                if (picker) {
                    var checkArr = picker.getChecked();
                    Ext.Array.each(checkArr, function (item) {
                        if (me.multiselect) {
                            item.set('checked', false);
                        }
                    });
                    var selectionModel = picker.getSelectionModel();
                    if (selectionModel) {
                        selectionModel.deselectAll();
                    }
                    if (picker.rendered == false) {
                        //未进行渲染
                    } else {
                        //已经渲染完成
                        picker.toFront();
                    }
                }
                var treeStore = this.getStore();
                treeStore.proxy.url = adminPath + 'api/rtTypes/{root}/children';
                treeStore.clearFilter();
                treeStore.root = {
                    _id: me.rootNode,
                    name: ''
                };
                var node = new (treeStore.model)({'_id': me.rootNode});
                node.store = treeStore;
                var oldRootNode = treeStore.getRootNode();
                if (oldRootNode.getId() == node.getId()) {
                    //根节点未改变
                } else {
                    if (me.rootNode == 'root') {
                        treeStore.proxy.extraParams = null;
                        treeStore.setRootNode(node);
                        treeStore.load({
                            start: 0,
                            page: 1,
                            limit: 25,
                            node: node
                        });
                    } else {
                        treeStore.proxy.extraParams = {
                            'filter': '[{"name":"isQueryChildren","value":false,"type":"boolean"}]'
                        };
                        treeStore.setRootNode(node);
                        treeStore.load({
                            start: 0,
                            page: 1,
                            limit: 25,
                            node: node
                        });
                    }
                }
                this.fireEvent('change', this, this.getValue());
            },*/
            listeners: {
                afterrender: function (comp) {
                    if (data.type == 'MaterialType') {
                        if (data.spuRtType) {
                            if (data.spuRtType._id) {//有值
                                me.down('toolbar').setVisible(true);
                                comp.setInitialValue([data.spuRtType._id]);
                            }
                        } else {//无值
                            comp.fireEvent('change', null, 'old');
                        }
                    } else {
                        me.down('toolbar').setVisible(false);
                        comp.fireEvent('change', null, 'old');
                        if (data.spuRtTypeRtObject) {
                            Ext.Ajax.request({
                                url: adminPath + 'api/bom/RtObject/' + data.spuRtTypeRtObject['_id'] + '?includeReferenceEntity=false',
                                method: 'GET',
                                headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                                success: function (res) {
                                    var responseMessage = Ext.JSON.decode(res.responseText);
                                    if (responseMessage.success) {
                                        var rtType = responseMessage.data.rtType;
                                        comp.setInitialValue([rtType['_id']]);
                                    } else {
                                        Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                    }
                                },
                                failure: function (resp) {
                                    var response = Ext.JSON.decode(resp.responseText);
                                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                                }
                            });
                        }
                    }
                },
                change: function (comp, newValue, oldValue) {
                    if (Ext.isEmpty(newValue)) {
                        newValue = 'root';
                    }
                    me.getStore().proxy.url = adminPath + 'api/rtTypes/' + newValue + '/rtAttributeDefs';
                    me.getStore().load({
                        callback: function (records) {
                            me.expandAll();
                        }
                    });

                }
            }
        };
        var checkRtType = {
            xtype: 'button',
            text: i18n.getKey('check') + i18n.getKey('rtType') + i18n.getKey('information'),
            handler: function (comp) {
                var rtTypeId = me.down('toolbar').getComponent('customTypeComp').getValue();
                JSOpen({
                    id: 'rttypespage',
                    url: path + "partials/rttypes/rttype.html?rtType=" + rtTypeId,
                    title: 'RtType',
                    refresh: true
                });
                //comp.ownerCt.ownerCt.getValue()
            }
        };
        if (Ext.isEmpty(data.parentMaterialType)) {//没有父选择
            var params = null;
            if (data.spuRtType) {//若选择了指定的物料类型了
                params = {
                    filter: '[{"name":"isQueryChildren","value":false,"type":"boolean"}]'
                }
            }
            rtTypeStore = Ext.create('CGP.material.store.RtType', {
                root: {
                    _id: data.spuRtType ? data.spuRtType['_id'] : 'root',//有选择了RtType，和未选择物料
                    name: data.spuRtType ? data.spuRtType['name'] : null
                },
                params: params
            });
            rtTypeTreeCombo.store = rtTypeStore;
            me.down('toolbar').add(rtTypeTreeCombo, checkRtType)
        } else {
            Ext.Ajax.request({
                url: adminPath + 'api/materials/' + data.parentMaterialType['_id'],
                method: 'GET',
                headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                success: function (res) {
                    var responseMessage = Ext.JSON.decode(res.responseText);
                    var data = responseMessage.data;
                    if (responseMessage.success) {
                        if (me.data.spuRtType) {
                            if (Ext.isEmpty(data.spuRtType)) {
                                rtTypeStore = Ext.create('CGP.material.store.RtType', {
                                    params: null//不知为啥，新建store时的proxy配置会应用旧的
                                });
                                rtTypeTreeCombo.store = rtTypeStore;
                                me.down('toolbar').add(rtTypeTreeCombo, checkRtType)
                            } else {
                                var rtTypeId = data.spuRtType._id;
                                Ext.Ajax.request({
                                    url: adminPath + 'api/rtTypes/' + me.data.spuRtType['_id'],
                                    method: 'GET',
                                    headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                                    success: function (res) {
                                        var responseMessage = Ext.JSON.decode(res.responseText);
                                        var rtTypeData = responseMessage.data;
                                        if (responseMessage.success) {
                                            rtTypeStore = Ext.create('CGP.material.store.RtType', {
                                                root: {
                                                    _id: rtTypeData._id,
                                                    name: rtTypeData.name
                                                },
                                                params: {
                                                    filter: '[{"name":"isQueryChildren","value":false,"type":"boolean"}]'
                                                }
                                            });
                                            me.rootNode = rtTypeData._id;//父物料选择了指定的rtType
                                            rtTypeTreeCombo.store = rtTypeStore;
                                            rtTypeTreeCombo.rootVisible = true;
                                            me.down('toolbar').add(rtTypeTreeCombo, checkRtType)

                                        } else {
                                            Ext.Msg.alert('提示', '请求错误：' + responseMessage.data.message)
                                        }
                                    },
                                    failure: function (resp) {
                                        var response = Ext.JSON.decode(resp.responseText);
                                        Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                                    }
                                });
                            }
                        } else {
                            rtTypeStore = Ext.create('CGP.material.store.RtType');
                            rtTypeTreeCombo.store = rtTypeStore;
                            me.down('toolbar').add(rtTypeTreeCombo, checkRtType)
                        }

                    } else {
                        Ext.Msg.alert('提示', '请求错误：' + responseMessage.data.message)
                    }
                },
                failure: function (resp) {
                    var response = Ext.JSON.decode(resp.responseText);
                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                }
            })
        }
        /*
         var rtTypeComp = me.down('toolbar').getComponent('customTypeComp');
         if(data.spuRtType){
         if(data.spuRtType.id){
         me.down('toolbar').setVisible(true);
         rtTypeComp.setValue('');
         rtTypeComp.setValue(data.spuRtType.id);
         }
         }else{
         me.down('toolbar').setVisible(false);
         rtTypeComp.setValue('');
         rtTypeComp.setValue(data.spuRtTypeRtObject.rtTypeId);
         }*/
        //data
        /*me.store.getProxy().url = adminPath + 'api/admin/runtimeType/rtTypes/{id}/children';
         me.store.load();*/
    }
});
