Ext.define("CGP.test.TestCusTree", {
    extend: "Ext.tree.Panel",
    width: 600,
    height: 300,
    collapsible: true,
    config: {
        rootVisible: false,
        useArrows: true,
        viewConfig: {
            stripeRows: true
        }
    },
    autoScroll: true,
    children: null,
    selectedItemCls: '',
        selModel: {
        selType: 'rowmodel',
        checkOnly: true
    },
    treeRtTypeSelect: {
        name: 'customTypeComp',
        xtype: 'treecombo',
        fieldLabel: i18n.getKey('rtType'),
        itemId: 'customTypeComp',
        store: Ext.create('CGP.material.store.RtType'),
        displayField: 'name',
        valueField: '_id',
        editable: false,
        rootVisible: false,
        selectChildren: false,
        canSelectFolders: false,
        width: 380,
        multiselect: false,
        listeners: {
            //展开时显示选中状态
            expand: function (field) {
                var recursiveRecords = [];

                function recursivePush(node, setIds) {
                    addRecRecord(node);
                    node.eachChild(function (nodesingle) {
                        if (nodesingle.hasChildNodes() == true) {
                            recursivePush(nodesingle, setIds);
                        } else {
                            addRecRecord(nodesingle);
                        }
                    });
                };
                function addRecRecord(record) {
                    for (var i = 0, j = recursiveRecords.length; i < j; i++) {
                        var item = recursiveRecords[i];
                        if (item) {
                            if (item.getId() == record.getId()) return;
                        }
                    }
                    if (record.getId() <= 0) return;
                    recursiveRecords.push(record);
                };
                var node = field.tree.getRootNode();
                recursivePush(node, false);
                Ext.each(recursiveRecords, function (record) {
                    var id = record.get(field.valueField);
                    if (field.getValue() == id && !Ext.isEmpty(field.getValue())) {
                        field.tree.getSelectionModel().select(record);
                    }
                });
            },
            afterrender: function (comp) {
                comp.tree.expandAll();
            }
        }
    },

    initComponent: function () {
        var me = this;
        /*this.cellEditing = new Ext.grid.plugin.CellEditing({
         clicksToEdit: 1
         });*/
        me.title = i18n.getKey('material') + i18n.getKey('category') + i18n.getKey('view');
        var materialStore = Ext.create('CGP.material.store.Material', {
                root: {
                    _id: 'root'
                }
            });
        materialStore.on('load',function(store, node, records){
            Ext.each(records,function(record){
                record.set('checked',false);
            })
        });
        //me.plugins = [this.cellEditing];
        //me.store = store;
        /*var AAsTORE = Ext.create('Ext.data.TreeStore', {
         fields: [
         'id','name','value',{name: 'leaf',type: 'boolean'},'valueType','selectType',{name: 'require',type: 'boolean'},{name: 'options',type: 'array'},'done'
         ],
         idProperty: 'name',
         autoSync: true,
         root: {
         expanded: true,
         children: [
         { id: '1',name: 'trrrr', leaf: true ,valueType: 'String',selectType: 'single',require: true,options: [{disname: 'test1',value: 'test1'},{disname: 'test2',value: 'test2'}]},
         { id: '2',name: 'homework',valueType: 'CustomType', expanded: true, children: [
         { id: '3',name: 'book report',valueType: 'String',selectType: 'multi', require: false,leaf: true ,options: [{disname: 'test3',value: 'test3'},{disname: 'test2',value: 'test2'}]},
         { id: '4',name: 'algerbra', valueType: 'String',require: true,leaf: true}
         ] },
         { id: '5',name: 'buy lottery tickets',valueType: 'String', leaf: true }
         ]
         }
         });*/
        var objectJson = {aaa: 'test1', trrrrr: {'test011': 'test2', 'algerbra': 'test3'}, 'scodix': 'test4'};
        var abc = {};
        me.store = Ext.create('CGP.material.store.RtAttributeTree', {
            root: {
                id: '592fc7000e481019c447cc6c'
            }
        });
        me.store.on('load', function (store, node, records) {
            Ext.Array.each(records, function (item) {
                //console.log(node);
                if (node.isRoot()) {
                    if (item.get('valueType') == 'CustomType') {
                        abc[item.get('code')] = {};
                    } else {
                        abc[item.get('code')] = null
                    }
                } else {
                    var path = node.getPath('code');
                    var array = path.split('/');
                    var valuePath = '$';
                    Ext.Array.each(array, function (item) {
                        if (!Ext.isEmpty(item)) {
                            valuePath += '.' + item;
                        }
                    });
                    if (item.get('valueType') == 'CustomType') {
                        jsonPath(abc, valuePath)[0][item.get('code')] = {};
                    } else {
                        jsonPath(abc, valuePath)[0][item.get('code')] = null
                    }
                }
            });
            Ext.Array.each(records,function(item){
                item.set('checked',true)
            });
        });
        me.columns = [
            {
                xtype: 'treecolumn',
                //text: i18n.getKey('name'),
                //tdCls: 'vertical-middle',
                header: 'aaa',
                flex: 2,
                dataIndex: 'code'

            },
            {
                //text: i18n.getKey('value'),
                flex: 2,
                xtype: 'componentcolumn',
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
                    var array = record.getPath('code').split('/');
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
                                    msgTarget: 'side',
                                    id: record.get('id'),
                                    listeners: {
                                        change: function (comp, newValue, oldValue) {
                                            /*var array = record.getPath('code').split('/');
                                            var value = abc;
                                            for (var i = 0; i < array.length; i++) {
                                                if (!Ext.isEmpty(array[i])) {

                                                    if (i == array.length - 1) {
                                                        if(Ext.isEmpty(newValue)){
                                                            value[array[i]] = null;
                                                        }else{
                                                            value[array[i]] = newValue;
                                                        }
                                                    } else {
                                                        value = value[array[i]];
                                                        objectJson = abc;
                                                    }
                                                }
                                            }*/
                                            //record.set('value',newValue);
                                        },
                                        afterrender: function (comp) {
                                            comp.setValue(jsonPath(objectJson, valuePath)[0]);
                                        }
                                    },
                                    allowBlank: false
                                }

                            } else if (Ext.Array.contains(['Number', 'int'], valueType)) {
                                comp = {
                                    xtype: 'numberfield',
                                    msgTarget: 'side',
                                    id: record.get('id'),
                                    listeners: {
                                        change: function (comp, newValue, oldValue) {
                                            var array = record.getPath('code').split('/');
                                            var value = abc;
                                            for (var i = 0; i < array.length; i++) {
                                                if (!Ext.isEmpty(array[i])) {

                                                    if (i == array.length - 1) {
                                                        if(Ext.isEmpty(newValue)){
                                                            value[array[i]] = null;
                                                        }else{
                                                            value[array[i]] = newValue;
                                                        }
                                                    } else {
                                                        value = value[array[i]];
                                                        objectJson = abc;
                                                    }
                                                }
                                            }
                                        },
                                        afterrender: function (comp) {
                                            comp.setValue(jsonPath(objectJson, valuePath)[0]);
                                        }
                                    },
                                    allowBlank: false
                                }

                            } else if (valueType === 'Boolean') {
                                comp = {
                                    xtype: 'combo',
                                    displayField: 'name',
                                    msgTarget: 'side',
                                    allowBlank: false,
                                    id: record.get('id'),
                                    valueField: 'value',
                                    listeners: {
                                        change: function (comp, newValue, oldValue) {
                                            var array = record.getPath('code').split('/');
                                            var value = abc;
                                            for (var i = 0; i < array.length; i++) {
                                                if (!Ext.isEmpty(array[i])) {

                                                    if (i == array.length - 1) {
                                                        if(Ext.isEmpty(newValue)){
                                                            value[array[i]] = null;
                                                        }else{
                                                            value[array[i]] = newValue;
                                                        }
                                                    } else {
                                                        value = value[array[i]];
                                                        objectJson = abc;
                                                    }
                                                }
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
                                    msgTarget: 'side',
                                    displayField: 'name',
                                    allowBlank: false,
                                    id: record.get('id'),
                                    valueField: 'value',
                                    listeners: {
                                        change: function (comp, newValue, oldValue) {
                                            var array = record.getPath('code').split('/');
                                            var value = abc;
                                            for (var i = 0; i < array.length; i++) {
                                                if (!Ext.isEmpty(array[i])) {

                                                    if (i == array.length - 1) {
                                                        if(Ext.isEmpty(newValue)){
                                                            value[array[i]] = null;
                                                        }else{
                                                            value[array[i]] = newValue;
                                                        }
                                                    } else {
                                                        value = value[array[i]];
                                                        objectJson = abc;
                                                    }
                                                }
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
                                    allowBlank: false,
                                    id: record.get('id'),
                                    msgTarget: 'side',
                                    valueField: 'value',
                                    listeners: {
                                        change: function (comp, newValue, oldValue) {
                                            var array = record.getPath('code').split('/');
                                            var value = abc;
                                            for (var i = 0; i < array.length; i++) {
                                                if (!Ext.isEmpty(array[i])) {

                                                    if (i == array.length - 1) {
                                                        if(Ext.isEmpty(newValue)){
                                                            value[array[i]] = null;
                                                        }else{
                                                            value[array[i]] = newValue;
                                                        }
                                                    } else {
                                                        value = value[array[i]];
                                                        objectJson = abc;
                                                    }
                                                }
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
                    /*if(valueType == 'String' ){
                     comp = {
                     xtype: 'textfield',
                     listeners: {
                     change: function(comp,newValue,oldValue){
                     var array = record.getPath('code').split('/');
                     var value = abc;
                     for(var i = 0;i<array.length;i++){
                     if(!Ext.isEmpty(array[i])){

                     if(i == array.length-1){
                     value[array[i]] = newValue;
                     }else{
                     value = value[array[i]];
                     objectJson = abc;
                     }
                     }
                     }
                     },
                     afterrender: function(comp){
                     comp.setValue(jsonPath(objectJson,valuePath)[0]);
                     }
                     },
                     allowBlank: false
                     }
                     }
                     if(selectType == 'single'){
                     comp = {
                     xtype: 'combo',
                     displayField: 'disname',
                     itemId: 'abc',
                     valueField: 'value',
                     value: jsonPath(objectJson,valuePath)[0],
                     listeners: {
                     change: function(comp,newValue,oldValue){
                     record.set('value',newValue)
                     }
                     },
                     store: Ext.create('Ext.data.Store',{
                     fields: ['disname','value'],
                     data: options
                     }),
                     queryMode: 'local'
                     }
                     }else if(selectType == 'multi'){
                     comp = {
                     xtype: 'combo',
                     displayField: 'disname',
                     multiSelect: true,
                     value: jsonPath(objectJson,valuePath)[0],
                     valueField: 'value',
                     listeners: {
                     change: function(comp,newValue,oldValue){
                     record.set('value',newValue)
                     }
                     },
                     store: Ext.create('Ext.data.Store',{
                     fields: ['disname','value'],
                     data: options
                     }),
                     queryMode: 'local'
                     }
                     }
                     if(valueType == 'CustomType'){
                     comp = null
                     }
                     if(Ext.getCmp('abc')){

                     }else{*/
                    return comp;
                    //}
                    //return comp;
                }

            }
        ];
        me.listeners = {
            /*cellclick: function (view, td, cellIndex, record, tr, rowIndex, e, eOpts) {
                var checked = !record.get('checked');
                if(cellIndex == 0){
                    record.set('checked',checked);
                }
                //record.set('checked',checked);
                //console.log(cellIndex);
            },*/
            afterrender: function () {
                me.expandAll();
                me.store.on('load', function () {
                    //me.collapseAll();
                })
            },
            beforeload: function (sto, operation, e) {
                var type = operation.node.get('valueType');
                var rtTypeId = operation.node.get('customTypeId');
                if (type == 'CustomType') {
                    sto.proxy.url = adminPath + 'api/admin/runtimeType/rtTypes/' + rtTypeId + '/rtAttributeDefs';
                } else {
                    sto.proxy.url = adminPath + 'api/admin/runtimeType/rtTypes/{id}/rtAttributeDefs';
                }
            },
            checkchange: function(node,newChecked){
                function eachNode(node){
                    for (var j = 0; j < node.childNodes.length; j++) {
                        if(node.childNodes[j].hasChildNodes()){
                            eachNode(node.childNodes[j]);
                        }
                        node.childNodes[j].set('checked', newChecked);
                    }
                }
                eachNode(node);
                function eachParentNode(node){
                    if(node.parentNode){
                        //eachParentNode(node.parentNode);
                        var isTureArr = [];
                        node.parentNode.eachChild(function(childNode){
                            if(childNode.get('checked')){
                                isTureArr.push(childNode);
                            }
                        });
                        if(Ext.isEmpty(isTureArr)){
                            node.parentNode.set('checked',false);
                            eachParentNode(node.parentNode);
                        }else{
                            node.parentNode.set('checked',true);
                            eachParentNode(node.parentNode);
                        }
                    }
                }
                eachParentNode(node);
            }
        };
        me.tbar = [
            {
                xtype: 'displayfield',
                fieldLabel: false,
                itemId: 'title',
                value: '<font color=green>' + '空' + '</font>'
            },
            {
                xtype: 'button',
                text: i18n.getKey('modify'),
                handler: function(){
                    Ext.create('Ext.window.Window',{
                        modal: true,
                        autoShow: true,
                        items: [{
                            xtype: 'form',
                            items:[
                                {
                                    name: 'customTypeComp',
                                    xtype: 'treecombo',
                                    fieldLabel: i18n.getKey('rtType'),
                                    itemId: 'customTypeComp',
                                    store: Ext.create('CGP.material.store.RtType'),
                                    displayField: 'name',
                                    valueField: '_id',
                                    editable: false,
                                    /*onTrigger1Click: function() {
                                     var selected = this.picker.getSelectionModel().getSelection();
                                     this.picker.getSelectionModel().deselectAll();
                                     this.reset();
                                     },
                                     onTrigger2Click: function() {
                                     this.onTriggerClick()
                                     },*/
                                    haveReset: true,
                                    frame: false,
                                    rootVisible: true,
                                    selectChildren: false,
                                    canSelectFolders: false,
                                    width: 380,
                                    multiselect: false,
                                    listeners: {
                                        //展开时显示选中状态
                                        expand: function (field) {
                                            var recursiveRecords = [];

                                            function recursivePush(node, setIds) {
                                                addRecRecord(node);
                                                node.eachChild(function (nodesingle) {
                                                    if (nodesingle.hasChildNodes() == true) {
                                                        recursivePush(nodesingle, setIds);
                                                    } else {
                                                        addRecRecord(nodesingle);
                                                    }
                                                });
                                            };
                                            function addRecRecord(record) {
                                                for (var i = 0, j = recursiveRecords.length; i < j; i++) {
                                                    var item = recursiveRecords[i];
                                                    if (item) {
                                                        if (item.getId() == record.getId()) return;
                                                    }
                                                }
                                                if (record.getId() <= 0) return;
                                                recursiveRecords.push(record);
                                            };
                                            var node = field.tree.getRootNode();
                                            recursivePush(node, false);
                                            Ext.each(recursiveRecords, function (record) {
                                                var id = record.get(field.valueField);
                                                if (field.getValue() == id && !Ext.isEmpty(field.getValue())) {
                                                    field.tree.getSelectionModel().select(record);
                                                }
                                            });
                                        },
                                        afterrender: function (comp) {
                                            comp.tree.expandAll();
                                        },
                                        change:function(comp,newValue,oldValue){
                                            console.log(newValue);
                                        }
                                    }
                                }
                        ]}/*,{
                            name: 'customTypeComp',
                            xtype: 'treecombo',
                            fieldLabel: i18n.getKey('rtType'),
                            itemId: 'customTypeComp',
                            store: Ext.create('CGP.material.store.RtType'),
                            displayField: 'name',
                            valueField: '_id',
                            editable: false,
                            *//*onTrigger1Click: function() {
                             var selected = this.picker.getSelectionModel().getSelection();
                             this.picker.getSelectionModel().deselectAll();
                             this.reset();
                             },
                             onTrigger2Click: function() {
                             this.onTriggerClick()
                             },*//*
                            haveReset: true,
                            rootVisible: false,
                            selectChildren: false,
                            canSelectFolders: true,
                            width: 380,
                            multiselect: false,
                            listeners: {
                                //展开时显示选中状态
                                expand: function (field) {
                                    var recursiveRecords = [];

                                    function recursivePush(node, setIds) {
                                        addRecRecord(node);
                                        node.eachChild(function (nodesingle) {
                                            if (nodesingle.hasChildNodes() == true) {
                                                recursivePush(nodesingle, setIds);
                                            } else {
                                                addRecRecord(nodesingle);
                                            }
                                        });
                                    };
                                    function addRecRecord(record) {
                                        for (var i = 0, j = recursiveRecords.length; i < j; i++) {
                                            var item = recursiveRecords[i];
                                            if (item) {
                                                if (item.getId() == record.getId()) return;
                                            }
                                        }
                                        if (record.getId() <= 0) return;
                                        recursiveRecords.push(record);
                                    };
                                    var node = field.tree.getRootNode();
                                    recursivePush(node, false);
                                    Ext.each(recursiveRecords, function (record) {
                                        var id = record.get(field.valueField);
                                        if (field.getValue() == id && !Ext.isEmpty(field.getValue())) {
                                            field.tree.getSelectionModel().select(record);
                                        }
                                    });
                                },
                                afterrender: function (comp) {
                                    comp.tree.expandAll();
                                }
                            }
                        }*/]
                    })
                }
            },{
                name: 'customTypeComp',
                xtype: 'materialtreecombo',
                fieldLabel: i18n.getKey('rtType'),
                itemId: 'customTypeComp',
                store: materialStore,
                displayField: 'name',
                valueField: '_id',
                editable: false,
                /*onTrigger1Click: function() {
                    var selected = this.picker.getSelectionModel().getSelection();
                    this.picker.getSelectionModel().deselectAll();
                    this.reset();
                },
                onTrigger2Click: function() {
                    this.onTriggerClick()
                },*/
                haveReset: true,
                extraColumn: [
                    {
                        text: i18n.getKey('type'),
                        flex: 1,
                        dataIndex: 'type',
                        renderer: function (value) {
                            var type;
                            if (value == 'MaterialSpu') {
                                type = '<div style="color: green">' + i18n.getKey(value) + '</div>'
                            } else if (value == 'MaterialType') {
                                type = '<div style="color: blue">' + i18n.getKey(value) + '</div>'
                            }
                            return type;
                        }

                    }
                ],
                rootVisible: false,
                selectChildren: false,
                canSelectFolders: true,
                width: 380,
                multiselect: true,
                listeners: {
                    //展开时显示选中状态
                    expand: function (field) {
                        var recursiveRecords = [];

                        function recursivePush(node, setIds) {
                            addRecRecord(node);
                            node.eachChild(function (nodesingle) {
                                if (nodesingle.hasChildNodes() == true) {
                                    recursivePush(nodesingle, setIds);
                                } else {
                                    addRecRecord(nodesingle);
                                }
                            });
                        };
                        function addRecRecord(record) {
                            for (var i = 0, j = recursiveRecords.length; i < j; i++) {
                                var item = recursiveRecords[i];
                                if (item) {
                                    if (item.getId() == record.getId()) return;
                                }
                            }
                            if (record.getId() <= 0) return;
                            recursiveRecords.push(record);
                        };
                        var node = field.tree.getRootNode();
                        recursivePush(node, false);
                        Ext.each(recursiveRecords, function (record) {
                            var id = record.get(field.valueField);
                            if (field.getValue() == id && !Ext.isEmpty(field.getValue())) {
                                field.tree.getSelectionModel().select(record);
                            }
                        });
                    },
                    afterrender: function (comp) {
                        comp.tree.expandAll();
                    }
                }
            },
            '->',
            {
                xtype: 'button',
                text: 'test',
                handler: function (comp) {
                    var selecttion = me.getSelectionModel().getSelection();
                    var value = me.down('toolbar').getComponent('customTypeComp').getValue();
                    //var aaa = Ext.getCmp('5002');
                    //aaa.isValid();
                    console.log(value);
                    //comp.ownerCt.ownerCt.getValue()
                }
            }
        ];
        me.callParent(arguments);

    },
    getValue: function () {
        var me = this;
        var store = me.getStore();
        var jsonValue = {};
        var rootNode = me.getRootNode();
        function getJsonValue(rootNode){

            Ext.Array.each(rootNode.childNodes, function (node) {
                //console.log(node);
                if (rootNode.isRoot()) {
                    if(node.get('checked')){
                        if (node.get('valueType') == 'CustomType') {
                            jsonValue[node.get('code')] = {};
                            if(node.hasChildNodes()){
                                getJsonValue(node);
                            }
                        } else {
                            jsonValue[node.get('code')] = Ext.getCmp(node.get('id')).getValue();
                        }
                    }
                } else {
                    var path = node.getPath('code');
                    var array = path.split('/');
                    var valuePath = '$';
                    for(var i = 0;i<array.length;i++){
                        if (!Ext.isEmpty(array[i])) {
                            if(i != array.length-1){
                                valuePath += '.' + array[i];
                            }
                        }
                    }

                    if(node.get('checked')){
                        if (node.get('valueType') == 'CustomType') {
                            jsonPath(jsonValue, valuePath)[0][node.get('code')] = {};
                            if(node.hasChildNodes()){
                                getJsonValue(node);
                            }
                        } else {
                            jsonPath(jsonValue, valuePath)[0][node.get('code')] = Ext.getCmp(node.get('id')).getValue();
                        }
                    }
                }
            });
        }
        getJsonValue(rootNode);
        console.log(me.getStore().getModifiedRecords());
        return(jsonValue);
    }
});