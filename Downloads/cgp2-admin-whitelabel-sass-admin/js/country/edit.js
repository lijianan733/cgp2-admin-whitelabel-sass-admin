/**
 * 国家设置的编辑页面Extjs
 */
Ext.onReady(function () {

    var page = Ext.widget({
        block: 'country',
        xtype: 'uxeditpage',
        accessControl:true,
        gridPage: 'country.html',
        formCfg: {
            model: 'CGP.country.model.CountryModel',
            remoteCfg: false,
            items: [
                {
                name: 'name',
                xtype: 'textfield',
                regex: /^\S+.*\S+$/,
                regexText: '值的首尾不能存在空格！',
                fieldLabel: i18n.getKey('name'),
                itemId: 'name',
                allowBlank: false
   			}, {
                name: 'isoCode2',
                xtype: 'textfield',
                allowBlank: false,
                maxLength: 2,
                minLength: 2,
                enforceMaxLength: true,
                fieldLabel: i18n.getKey('isoCode') + '(2)',
                itemId: 'isoCode2'
   			}, {
                name: 'isoCode3',
                xtype: 'textfield',
                maxLength: 3,
                minLength: 3,
                enforceMaxLength: true,
                fieldLabel: i18n.getKey('isoCode') + '(3)',
                itemId: 'isoCode3'
   			}]
        },
        listeners: {
            afterload: function(page){
                if(page.form.getCurrentMode() == 'editing'){
                    page.toolbar.add({
                        xtype: 'button',
                        text: i18n.getKey('config')+i18n.getKey('multilingual'),
                        iconCls: 'icon_multilangual',
                        itemId: 'multilangual',
                        handler: function(){
                            var form = this.ownerCt.ownerCt.form;
                            var record = form._rawModels.items[0];
                            var id = record.getId();
                            var title = page.block;
                            var multilingualKey = record.get('multilingualKey');
                            JSOpen({
                                id: 'edit' + '_multilingual',
                                url: path + "partials/common/editmultilingual.html?id=" + id + '&title=' + title + '&multilingualKey=' + multilingualKey,
                                title: i18n.getKey(title)+i18n.getKey('multilingual')+i18n.getKey('config')+'('+i18n.getKey('id')+':'+id+')',
                                refresh: true
                            });

                        }
                    })
                }
            }
        }
    });
});