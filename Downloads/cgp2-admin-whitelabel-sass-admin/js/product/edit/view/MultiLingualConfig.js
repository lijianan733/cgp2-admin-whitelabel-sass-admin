Ext.define("CGP.product.edit.view.MultiLingualConfig",{
    extend: 'Ext.tab.Panel',
    activeTab: 0,
    initComponent: function(){
        var me = this;
        var language = Ext.create('CGP.common.store.Language');
        //me.title = i18n.getKey('resources')+i18n.getKey('config')+'('+me.title+'：'+me.id+')';
        var multiLingualCfgRecord = top.multilingualCfgStore.findRecord('entityClass',me.multilingualKey);
        var attrArray = [];
        if(multiLingualCfgRecord){
            attrArray = multiLingualCfgRecord.get('attributeNames');
        }

        me.items = [];

        var htmlFieldArray = ['description1','description2','description3'];
        language.load({callback: function(records, options, success){
            Ext.Array.each(records,function(item){
                var fields = [];
                var languageCode = item.get('code').code;
                if (item.get('locale')) {
                    languageCode += '_' + item.get('locale').code;
                }
                var resource = Ext.create('CGP.common.store.Resource',{
                    params:{
                        filter : '[{"name":"cultureCode","value":'+'"'+languageCode+'"'+',"type":"string"},{"name":"name","value":'+'"%'+me.multilingualKey+'-'+me.id+'%"'+',"type":"string"}]'
                    }
                });
                resource.load({callback:function(records, options, success){
                    Ext.Array.each(attrArray,function(attribute,index){
                        var key = me.multilingualKey+'-'+me.id+'-'+attribute;
                        var record = resource.findRecord('name',key);
                        var field;
                        if(record){
                            field = {
                                xtype: 'textfield',
                                itemId: attribute,
                                fieldLabel: attribute,
                                locale:languageCode,
                                name: 'clazz'+'-'+'id'+'-'+attribute,
                                value: record.get('value')
                            };
                        }else{
                            field = {
                                xtype: 'textfield',
                                itemId: attribute,
                                fieldLabel: attribute,
                                locale: languageCode,
                                name: 'clazz'+'-'+'id'+'-'+attribute
                            };
                        }
                        if(Ext.Array.contains(htmlFieldArray,field.itemId)){
                            field.xtype = 'htmleditor';
                            field.style = 'margin:20px';
                            /*field.plugins= [Ext.create('Ext.ux.form.HtmlEditor.Maximize', {
                                htmleditor: this,
                                editorItemId: field.itemId
                            })];*/
                            field.width = 900;
                        }
                        fields.push((field));
                    });
                    var tab = {
                        xtype: 'form',
                        title: item.get('name'),
                        //            height: 400,
                        border: false,
                        bodyPadding: 10,
                        tbar: [{
                            xtype: 'button',
                            text: i18n.getKey('save'),
                            iconCls: 'icon_save',
                            handler:function(){
                                var form = this.ownerCt.ownerCt;
                                me.modify(form,resource);
                            }
                        }],
                        layout: {
                            type: 'table',
                            columns: 1
                        },
                        defaults: {
                            width: 350
                        },
                        items: fields
                    };
                    me.add(tab);
                }});
                /*Ext.Array.each(attrArray,function(attribute){
                 var field = {
                 xtype: 'textfield',
                 itemId: attribute,
                 fieldLabel: attribute,
                 locale: item.get('code')+'_'+item.get('locale'),
                 name: 'clazz'+'-'+'id'+'-'+attribute
                 };
                 fields.push((field));
                 });
                 var tab = {
                 xtype: 'form',
                 title: item.get('code')+'_'+item.get('locale'),
                 //            height: 400,
                 border: false,
                 bodyPadding: 10,
                 layout: {
                 type: 'table',
                 columns: 1
                 },
                 defaults: {
                 width: 350
                 },
                 items: fields
                 };
                 me.add(tab);*/
            });
        }});
        me.callParent(arguments);

    },
    modify: function(){

    }
});
