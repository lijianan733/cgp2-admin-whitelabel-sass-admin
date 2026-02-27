Ext.define('CGP.test.HelpCombo',{
    extend: 'Ext.form.field.ComboBox',
    alternateClassName: 'Ext.form.ComboBox1',
    alias: ['widget.combobox1', 'widget.combo1'],
    requires: [
        'Ext.button.Button'
    ],
    initComponent: function () {
        var me = this;

        this.callParent();
        me.listeners = {
            //表单验证是msgTarget为‘side’时，对tipButton位置做调整
            validitychange: function(comp,isValid){
                if(!isValid && comp.msgTarget == 'side'){
                    me.button.setMargin('0 0 0 30');
                }else{
                    me.button.setMargin('0 0 0 10');
                }
            }
        }
    },
    childEls: ['help'],

    getSubTplMarkup: function(values) {
        var me = this,
            childElCls = values.childElCls,
            field = me.callParent(arguments);
        var extraButtonTpl = me.getExtraButtonTpl();
        if(me.buttonConfig.hidden){
            extraButtonTpl = '<td id=' + this.id + '-help></td>';
        }
        return '<table id="'+me.id+'-triggerWrap" class="x-form-trigger-wrap" cellpadding="0" cellspacing="0"><tbody>' +
            '<tr><td id="'+me.id+'-inputCell" class="x-form-trigger-input-cell"><div class="x-hide-display x-form-data-hidden" role="presentation"></div>' +
            '<input id="'+me.id+'-inputEl" type="text"  class="x-form-field x-form-text " autocomplete="off" name="'+me.id+'-inputEl"/></td><td valign="top" class=" x-trigger-cell x-unselectable" style="width:22px;">' +
            '<div class="x-trigger-index-0 x-form-trigger x-form-arrow-trigger x-form-trigger-first" role="button"></div></td>'+extraButtonTpl+'</tr></tbody></table>';
    },
    getExtraButtonTpl: function(){
        return '<td id=' + this.id + '-help></td>';
    },

   onRender: function() {
       var me = this,
           id = me.id,
           inputEl;

       me.callParent(arguments);
       /*var tip = Ext.create('Ext.tip.ToolTip', {
           target: id+'button',
           html: 'Press this button to clear the form'
       });*/

       me.button = Ext.create('Ext.button.Button', Ext.apply({
           text: false,
           id: id+'button',
           width: 22,
           border: false,
           /*listeners: {
               render: function(){
                   Ext.create('Ext.tip.ToolTip', {
                       target: id+'button',
                       html: '优先级dfhgfgggggggggggggggggggggggggggggggggggggggggggggggggggggggfffffffffff'+'\n'+'ffffffffffffffffffffffffffffffff'
                   });
               }
           },*/
           //ownerLayout: 'triggerfield',
           margin: '0 0 0 10',
           //height: 28,
           //hidden: true,
           iconCls: 'icon_help',
           renderTo: id + '-help',
           //style : 'button_color: red',
           cls: 'x-btn-default-toolbar-small'/*,
           //baseCls: 'x-btn',
           //style : 'button_color:red',
           handler: function () {
               var tip = Ext.create('Ext.tip.ToolTip', {
                   target: id,
                   html: 'Press this button to clear the form'
               });
           }*/
       }, me.buttonConfig));
   }
});
