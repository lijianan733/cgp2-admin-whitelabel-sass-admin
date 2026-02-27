/**
 * @Description:
 * @author nan
 * @date 2023/11/16
 */
Ext.define('CGP.common.field.TextareCodemirror', {
    extend: 'Ext.form.field.TextArea',
    alias: 'widget.textarea_codemirror',
    codeMirrorConfig: null,
    initComponent: function () {
        var me = this;
        me.callParent();
        me.on({
            boxready: function () {
                var me = this;
                me.uuId = JSGetUUID();
                me.codeMirror = CodeMirror.fromTextArea(me.inputEl.dom, Ext.Object.merge({
                    mode: "javascript",
                    lineNumbers: true,//是否显示行号
                    lineWrapping: true,//是否自动换行
                    matchBrackets: true, // 括号匹配
                    readOnly: me.readOnly,
                    smartIndent: true, // 自动缩进，设置是否根据上下文自动缩进（和上一行相同的缩进量）。默认为true
                    gutters: ["CodeMirror-lint-markers"],
                    lint: {options: {esversion: 2021}},
                }, me.codeMirrorConfig));
                me.codeMirror?.setSize(me.getWidth(), me.getHeight())
                me.codeMirror?.on('change', function (codeMirror, obj) {
                    codeMirror.save();
                    var newValue = (me.getValue());
                    me.fireEvent('change', me, newValue, me.uuId);//特殊标识不重复触发change事件
                });
            },
            change: function (textarea, newValue, oldValue) {
                var me = this;
                if (oldValue != me.uuId) {//特殊标识不重复触发change事件
                    me.codeMirror?.setValue(newValue);
                }
            },
            resize: function (field, newWidth, oldHeight) {
                var me = this;
                me.codeMirror?.setSize(newWidth, oldHeight);
            }
        })
    }
})