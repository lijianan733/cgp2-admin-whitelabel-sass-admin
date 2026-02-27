/**
 * Created by nan on 2019/1/21.
 */
Ext.define('CGP.product.view.bothwayattributemapping.view.AttributeTreePanel', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.attributetreepanel',
    store: null,
    title: null,
    header: false,
    rootVisible: false,
    //hideHeaders: true,
    columnLines: true,
    useArrows: true,
    lines: false,
    viewConfig: {
        stripeRows: true,
        enableTextSelection: true
    },
    selType: 'checkboxmodel',
    addNewRecord: null,//自定义的加入新记录的方法
    deleteRecord: null,//自定义删除记录的方法
    localSkuAttributes: null,//记录当前该组件使用中的SkuAttributeId
    constructor: function () {
        var me = this;
        me.localSkuAttributes = [];
        me.callParent(arguments);
    },
    setValue: function (data) {
        var me = this;
        me.localSkuAttributes = [];
        //me.store=Ext.create('CGP.product.view.bothwayattributemapping.store.AttributeTreeLocal');
        Ext.Array.each(data,function(result){
            result.propertyValue=result.value.value;
            var propertyPath=result.propertyPath;
//            if(result.propertyName=='Value'&&result.skuAttribute.attribute.inputType=="DropList"){
//                var option=Ext.Array.findBy(result.skuAttribute.attribute.options,function(opt){
            if(propertyPath.propertyName=='Value'&&propertyPath.skuAttribute.attribute.inputType=="DropList"){
                var option=Ext.Array.findBy(propertyPath.skuAttribute.attribute.options,function(opt){
                    return opt.id==Ext.Number.from(result.value.value,0);
                });
                if(option){
                    result.propertyValue=option.name;
                }
                else{
                    result.propertyValue='';
                }
            }
            var node = me.store.getRootNode().findChild('text', propertyPath.skuAttribute.attribute.name + '(' + propertyPath.skuAttribute.id + ')');
            if(Ext.isEmpty(node)){
                var root = me.store.getRootNode();
                var child=me.nodeAddChild(root,result,false,'../../../ClientLibs/extjs/resources/themes/images/ux/attribute.png');
                me.nodeAddChild(child,result,true,'../../../ClientLibs/extjs/resources/themes/images/ux/property.png');
                me.localSkuAttributes.push(propertyPath.skuAttribute.id);
            }
            else {
                var childrenNode = node.findChild('text', propertyPath.propertyName);
                if(Ext.isEmpty(childrenNode)){
                    me.nodeAddChild(node,result,true,'../../../ClientLibs/extjs/resources/themes/images/ux/property.png');
                }
                else{
                    Ext.Msg.confirm(i18n.getKey('prompt'), '该property已经存在,是否覆盖其值?', function (select) {
                        if (select == 'yes') {
                            node.removeChild(childrenNode);
                            me.nodeAddChild(node,result,true,'../../../ClientLibs/extjs/resources/themes/images/ux/property.png');
                        }
                    })
                }
            }
        });
        me.expandAll();
    },
    getValue: function () {
        var me = this;
        var value = [];
        me.localSkuAttributes = [];
        var rootNode = me.getRootNode();
        rootNode.cascadeBy(function (node) {//遍历所有子叶节点，取出值
            if (node.isLeaf()) {
                value.push(
                    node.get('recordData')

                );
            }
        });
        return value;
    },

    nodeAddChild:function(node,result,leaf,image){
        var text=leaf?result.propertyPath.propertyName:result.propertyPath.skuAttribute.attribute.name + '(' + result.propertyPath.skuAttribute.id + ')';
        var child={
            text: text,
            propertyValue:leaf?result.propertyValue:'',
            leaf: leaf,
            parentId:leaf?result.propertyPath.skuAttribute.attribute.name + '(' + result.propertyPath.skuAttribute.id + ')':null,
            children:[],
            icon: image,
            id: JSGetUUID(),
            skuAttributeid:result.propertyPath.skuAttribute.id,
            skuAttribute: result.propertyPath.skuAttribute,
            propertyName: result.propertyPath.propertyName,
            recordData: result,
            profileName:leaf?result.propertyPath.attributeProfile.name:'',
            entryLink:leaf?result.propertyPath.entryLink:''
        };
        node.appendChild(child);
        return node.findChild('text',text);
    },
    initComponent: function () {
        var me = this;

        me.tbar = [
                '<strong style="color: green;font-size: 110%">' + i18n.getKey(me.title) + '</strong>', '->',
            {
                xtype: 'button',
                text: i18n.getKey('compile'),
                iconCls: 'icon_edit',
                handler: me.addNewRecord || function (btn) {
                    var title = null;
                    var skuAttributes=me.skuAttributesGrid.getSubmitValue();
                    if (skuAttributes.length > 0) {//被影响属性有值
                        var window = Ext.create('CGP.product.view.bothwayattributemapping.view.ProductAttributeMappingRule', {
                            attributeTreePanel: me,
                            createOrEdit: 'create',
                            skuAttributes: {},//通过setValue方法添加
                            productId: me.productId,
                            title:i18n.getKey(me.title)
                        });
                        var mappingRuleFieldSet=Ext.getCmp('mappingRuleEffectedAttFieldSet'),data=[];
                        //mappingRuleGrid中的值转换成设置属性值页面的结构
                        var translateValue=function(recordValue,Attributes){
                            var valueData=[];
                            Ext.Array.each(Attributes,function(att){
                                var values=Ext.Array.filter(recordValue,function(value){
                                    return value.propertyPath.skuAttributeId==att.id;
                                });
                                if(Ext.isEmpty(values)){//values是空值是设置propertyName默认值为Value
                                    values=[{
                                        "clazz" : "com.qpp.cgp.domain.attributeproperty.AttributePropertyValue",
                                        "value" : {
                                            "clazz" : "com.qpp.cgp.domain.executecondition.operation.value.FixValue",
                                            "value" : ""
                                        },
                                        "propertyValue" : "",
                                        "propertyPath":{
                                            "skuAttributeId" : att.id,
                                            "propertyName" : "Value",
                                            "attributeProfile":''
                                        }
                                        }];
                                }
                                var attValue={skuAttribute:att,
                                    data:values.map(function(value){
                                        value['skuAttribute']=att;
                                        return value;
                                    })
                                };
                                valueData.push(attValue);
                            });
                            return valueData;
                        };
                        data=translateValue(Ext.isArray(me.getValue())?me.getValue():[],skuAttributes);
                        mappingRuleFieldSet.setValue(data);
                        window.show();
                    } else {
                        Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('必须先确定被影响属性,再设置属性规则'));
                    }
                }
            },
            {
                xtype: 'button',
                text: i18n.getKey('delete'),
                iconCls: 'icon_bullet_delete',
                handler: me.deleteRecord || function (btn) {
                    var selectedRecords = me.getSelectionModel().getSelection();
                    var rootNode = me.getRootNode();
                    if (selectedRecords.length > 0) {
                        Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('deleteConfirm'), function (select) {
                            if (select == 'yes') {
                                for (var i = 0; i < selectedRecords.length; i++) {
                                    if (selectedRecords[i].isLeaf()) {//叶子节点
                                        var node = rootNode.findChild('skuAttributeid', selectedRecords[i].get('skuAttributeid'), true);//担心该节点已经被删掉了
                                        node.removeChild(selectedRecords[i]);
                                        if(!node.hasChildNodes()){
                                            rootNode.removeChild(node);
                                        }
                                    } else {
                                        rootNode.removeChild(selectedRecords[i]);
                                    }
                                }
                                if(me.itemId=='left'){
                                    me.mappingData.leftValues=me.getValue();
                                }
                                else{
                                    me.mappingData.rightValues=me.getValue();
                                }
                            }
                        })
                    }
                }
            }
        ];
        me.store = Ext.create('CGP.product.view.bothwayattributemapping.store.AttributeTreeLocal');
        me.columns = [
            {
                xtype: 'componentcolumn',
                flex: 1,
                dataIndex: 'entryLink',
                text: 'entryLink',
                itemId: 'entryLink',
                resizable: true,
                tdCls: 'vertical-middle',
                renderer: function (value, metadata, record) {
                    var result='';
                    if(!Ext.isEmpty(value)){
                        result=value.linkName;
                    }
                    metadata.tdAttr = 'data-qtip="' + result + '"';
                    return {
                        xtype: 'displayfield',
                        value: result
                    };
                }
            },
            {
                xtype: 'componentcolumn',
                flex: 1,
                dataIndex: 'profileName',
                text: 'profileName',
                itemId: 'profileName',
                resizable: true,
                tdCls: 'vertical-middle',
                renderer: function (value, metadata, record) {
                    metadata.tdAttr = 'data-qtip="' + value + '"';
                    return {
                        xtype: 'displayfield',
                        value: value
                    };
                }
            },
            {
                xtype: 'treecolumn',
                flex: 1,
                dataIndex: 'text',
                text: 'attribute',
                itemId: 'attribute',
                resizable: true,
                tdCls: 'vertical-middle',
                renderer: function (value, metadata, record) {
                    metadata.tdAttr = 'data-qtip="' + value + '"';
                    var leaf = record.get('leaf');
                    if (!leaf) {
                        return '<strong>' + value + '</strong>';
                    }
                    return value;
                }
            },
            {
                flex: 1,
                dataIndex: 'propertyValue',
                xtype: 'componentcolumn',
                text: 'propertyValue',
                itemId: 'propertyValue',
                resizable: true,
                tdCls: 'vertical-middle',
                renderer: function (value, metadata, record) {
                    metadata.tdAttr = 'data-qtip="' + value + '"';
                    return {
                        xtype: 'displayfield',
                        value: value
                    };

                }
            }
        ];
        me.callParent(arguments);
        if(!Ext.isEmpty(me.valueData)){
            me.setValue(me.valueData);
        }
    }
})
