Ext.define("CGP.product.edit.view.multilingual.ProudctMediaMultilingual", {
    extend: 'Ext.tab.Panel',
    initComponent: function () {
        var me = this;
        var language = Ext.create('CGP.common.store.Language');
        var mediaArr = [];
        if(!Ext.isEmpty(me.mediaArr)){
            mediaArr = me.mediaArr.split(',');
        }
        var mediaNameArr = [];
        if(!Ext.isEmpty(me.mediaNameArr)){
            mediaNameArr = me.mediaNameArr.split(',');
        }
        //me.title = i18n.getKey('resources')+i18n.getKey('config')+'('+me.title+'：'+me.id+')';
        var multiLingualCfgRecord = top.multilingualCfgStore.findRecord('entityClass', me.multilingualKey);
        var attrArray = [];
        if (multiLingualCfgRecord) {
            attrArray = multiLingualCfgRecord.get('attributeNames');
        }

        me.items = [];

        language.load({callback: function (records, options, success) {
            Ext.Array.each(records, function (item) {
                var fields = [];
                var languageCode = item.get('code').code;
                if (item.get('locale')) {
                    languageCode += '_' + item.get('locale').code;
                }
                var resource = Ext.create('CGP.common.store.Resource', {
                    params: {
                        filter: '[{"name":"cultureCode","value":' + '"' + languageCode + '"' + ',"type":"string"},{"name":"name","value":' + '"%' + me.multilingualKey + '-' + '%"' + ',"type":"string"}]'
                    }
                });
                resource.load({callback: function (records, options, success) {
                    Ext.Array.each(mediaArr, function (media, index) {
                        var key = me.multilingualKey + '-' + media + '-name';
                        var record = resource.findRecord('name', key);

                        var field = {
                            xtype: 'fieldcontainer',
                            itemId: 'fieldcontainer' + media,
                            width: 510,
                            name: 'fieldcontainer',
                            layout: 'hbox',
                            labelWidth: 100,
                            fieldLabel: i18n.getKey('image')+'('+media+')',
                            items: [
                                {
                                    name: 'files',
                                    xtype: 'filefield',
                                    width: 350,
                                    enableKeyEvents: true,
                                    buttonText: i18n.getKey('choice'),
                                    listeners: {
                                        render:function(comp){
                                            if(record){
                                                comp.setRawValue(record.get('value'));
                                            }
                                        }
                                    },
                                    fieldLabel: false/*i18n.getKey('image')*/,
                                    itemId: 'file' + media
                                },
                                {
                                    xtype: 'button',
                                    text: i18n.getKey('upload'),
                                    width: 50,
                                    handler: function () {
                                        var fieldContainer = this.ownerCt;
                                        var formpanel = Ext.create("Ext.ux.form.Panel", {
                                            itemId: 'form' + media,
                                            hidden: true,
                                            items: []
                                        });
                                        var fileImage = fieldContainer.getComponent('file' + media);
                                        //var priviewField = fieldContainer.ownerCt.getComponent('preview'+media);
                                        formpanel.add(fileImage);
                                        var clone = fileImage.cloneConfig();
                                        fieldContainer.insert(0, clone);
                                        formpanel.submit({
                                            url: adminPath + 'api/files',
                                            method: 'POST',
                                            headers: {
                                                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                                            },
                                            success: function (form, action) {
                                                var imageName = action.response.data[0].name;
                                                var imageField = fieldContainer.ownerCt.getComponent(media + '-name');
                                                var previewField = fieldContainer.ownerCt.getComponent('preview' + media);
                                                fieldContainer.getComponent('file' + media).setRawValue(imageName);
                                                imageField.setValue(imageName);
                                                previewField.setSrc(imageServer + imageName);
                                            },
                                            failure: function (form, action) {
                                                Ext.Msg.alert('提示', '上传失败！')
                                            }
                                        });
                                    }
                                }
                            ]
                        };

                        var image = {
                            xtype: 'textfield',
                            hidden: true,
                            itemId: media + '-name',
                            fieldLabel: i18n.getKey('name') + '(' + media + ')',
                            locale: languageCode,
                            name: me.multilingualKey + '-' + media + '-name'
                        };
                        var original = {
                            xtype: 'displayfield',
                            value: '原图：',
                            width: 50,
                            fieldLabel: false

                            };
                        var configImg = {
                            xtype: 'displayfield',
                            value: '配置图：',
                            width: 60,
                            fieldLabel: false

                        };
                        var originalPreview = {
                            xtype: 'image',
                            width: 70,
                            title: '原图',
                            style: 'cursor: pointer',
                            height: 70,
                            src: imageServer+mediaNameArr[index],
                            padding: '5 5 5 5',
                            itemId: 'originalPreview' + media,
                            listeners: {
                                el: {
                                    click: function (event, img, c) {
                                        JSImagePreview(img.src);
                                    }
                                }
                            }/*,
                             style: {
                             marginLeft: 45
                             }*/
                            //
                        };
                        var preview = {
                            xtype: 'image',
                            width: 70,
                            title: '配置图',
                            style: 'cursor: pointer',
                            height: 70,
                            padding: '5 5 5 5',
                            itemId: 'preview' + media,
                            listeners: {
                                el: {
                                    click: function (event, img, c) {
                                        if(!Ext.isEmpty(img.src)){
                                            JSImagePreview(img.src);
                                        }
                                    }
                                }
                            }/*,
                             style: {
                             marginLeft: 45
                             }*/
                            //
                        };
                        if (record) {
                            field.value = record.get('value');
                            image.value = record.get('value');
                            preview.src = imageServer + record.get('value');
                        }

                        //var
                        fields.push(field, original,originalPreview,configImg,preview, image);
                    });
                    var tab = {
                        xtype: 'form',
                        title: item.get('name'),
                        //            height: 400,
                        border: false,
                        bodyPadding: 10,
                        tbar: [
                            {
                                xtype: 'button',
                                text: i18n.getKey('save'),
                                iconCls: 'icon_save',
                                handler: function () {
                                    var form = this.ownerCt.ownerCt;
                                    me.modify(form, resource);
                                }
                            }
                        ],
                        layout: {
                            type: 'table',
                            columns: 5
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


    modify: function (page, store) {
        var values = Ext.Object.getValues(page.getValues());//获取表单中所有的值，包括空值
        var fields = [];
        //获取所有的字段
        Ext.Array.each(page.items.items,function(item){
            if(item.xtype == 'textfield'){
                fields.push(item);
            }
        });
        for (var i = 0; i < fields.length; i++) {
            var field = fields[i];
            var record = store.findRecord('name', field.name);
            //在store中没有itemId
            if (Ext.isEmpty(record)) {
                if (values[i].toString() == "" || values[i].toString() == "NaN") {
                } else { //空值不保存
                    store.add({
                        name: field.name,
                        type: 'CaptionRes',
                        websiteId: store.websiteId,
                        cultureCode: field.locale,
                        value: field.getValue(),
                        active: true,
                        multilingualKey: 'com.qpp.cgp.domain.management.LanguageResource'
                    });
                }
            } else {
                //在store中有itemId
                if (field.getValue() != record.get('value').toString()) {
                    record.set('value', field.getValue().toString());
                }
            }
        }
        //store.proxy.url = adminPath + 'api/configurations';
        store.sync();
        Ext.MessageBox.alert('提示', '保存成功！');
        /*
         page.ownerCt.close();
         */
    }
});
