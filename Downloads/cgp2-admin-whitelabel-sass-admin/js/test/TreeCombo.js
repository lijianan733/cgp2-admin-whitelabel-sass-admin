/// <reference path="ext/ext-all-debug.js" />

Ext.define('CGP.test.TreeCombo', {
    extend: 'Ext.form.field.Picker',
    alias: ['widget.treecomboa'],
    mixins: {
        bindable: 'Ext.util.Bindable'
    },

    /**
     * @cfg {String} [triggerCls='x-form-arrow-trigger']
     * An additional CSS class used to style the trigger button. The trigger will always get the {@link #triggerBaseCls}
     * by default and `triggerCls` will be **appended** if specified.
     */
    // triggerCls: Ext.baseCSSPrefix + 'form-arrow-trigger',

    /**
     * @cfg {String} [hiddenName=""]
     * The name of an underlying hidden field which will be synchronized with the underlying value of the combo.
     * This option is useful if the combo is part of a form element doing a regular form post. The hidden field
     * will not be created unless a hiddenName is specified.
     */
    hiddenName: '',

    /**
     * @private
     * @cfg {String}
     * CSS class used to find the {@link #hiddenDataEl}
     */
    hiddenDataCls: Ext.baseCSSPrefix + 'hide-display ' + Ext.baseCSSPrefix + 'form-data-hidden',

    /**
     * @cfg
     * @inheritdoc
     */
    fieldSubTpl: [
        '<div class="{hiddenDataCls}" role="presentation"></div>',
        '<input id="{id}" type="{type}" {inputAttrTpl}',
        '<tpl if="value"> value="{[Ext.util.Format.htmlEncode(values.value)]}"</tpl>',
        '<tpl if="name"> name="{name}"</tpl>',
        '<tpl if="placeholder"> placeholder="{placeholder}"</tpl>',
        '<tpl if="size"> size="{size}"</tpl>',
        '<tpl if="maxLength !== undefined"> maxlength="{maxLength}"</tpl>',
        '<tpl if="readOnly"> readonly="readonly"</tpl>',
        '<tpl if="disabled"> disabled="disabled"</tpl>',
        '<tpl if="tabIdx"> tabIndex="{tabIdx}"</tpl>',
        '<tpl if="fieldStyle"> style="{fieldStyle}"</tpl>',
        'class="{fieldCls} {typeCls}" autocomplete="off" />',
        {
            compiled: true,
            disableFormats: true
        }
    ],

    getSubTplData: function () {
        var me = this;
        Ext.applyIf(me.subTplData, {
            hiddenDataCls: me.hiddenDataCls
        });
        return me.callParent(arguments);
    },

    afterRender: function () {
        var me = this;
        me.callParent(arguments);
        me.setHiddenValue(me.value);
    },

    /**
     * @cfg {Boolean} multiSelect
     * If set to `true`, allows the combo field to hold more than one value at a time, and allows selecting multiple
     * items from the dropdown list. The combo's text field will show all selected values separated by the
     * {@link #delimiter}.
     */
    multiSelect: true,

    /**
     * @cfg {String} delimiter
     * The character(s) used to separate the {@link #displayField display values} of multiple selected items when
     * `{@link #multiSelect} = true`.
     */
    //<locale>
    delimiter: ', ',
    //</locale>

    /**
     * @cfg {String} displayField
     * The underlying {@link Ext.data.Field#name data field name} to bind to this ComboBox.
     *
     * See also `{@link #valueField}`.
     */
    displayField: 'text',

    /**
     * @cfg {Boolean} typeAhead
     * `true` to populate and autoselect the remainder of the text being typed after a configurable delay
     * ({@link #typeAheadDelay}) if it matches a known value.
     */
    typeAhead: false,

    /**
     * @cfg {Number} typeAheadDelay
     * The length of time in milliseconds to wait until the typeahead text is displayed if `{@link #typeAhead} = true`
     */
    typeAheadDelay: 250,

    /**
     * @cfg {Boolean} forceSelection
     * `true` to restrict the selected value to one of the values in the list, `false` to allow the user to set
     * arbitrary text into the field.
     */
    forceSelection: false,

    /**
     * @cfg {Boolean} growToLongestValue
     * `false` to not allow the component to resize itself when its data changes
     * (and its {@link #grow} property is `true`)
     */
    growToLongestValue: true,

    /**
     * @cfg {String} valueNotFoundText
     * When using a name/value combo, if the value passed to setValue is not found in the store, valueNotFoundText will
     * be displayed as the field text if defined. If this default text is used, it means there
     * is no value set and no validation will occur on this field.
     */

    /**
     * @cfg {Object} defaultListConfig
     * Set of options that will be used as defaults for the user-configured {@link #listConfig} object.
     */
    defaultListConfig: {
        loadingHeight: 70,
        minWidth: 70,
        maxHeight: 300,
        forceFit: true,
        useArrows: true,
        rootVisible: false,
        bodyStyle: {
            overflow: 'auto'
        },
        shadow: 'sides'
    },

    //private
    ignoreSelection: 0,

    //private helper
    resizeComboToGrow: function () {
        var me = this;
        return me.grow && me.growToLongestValue;
    },

    initComponent: function () {
        var me = this,
            store = me.store;

        me.editable = false;

        Ext.applyIf(me.renderSelectors, {
            hiddenDataEl: '.' + me.hiddenDataCls.split(' ').join('.')
        });

        this.addEvents(
            /**
             * @event select
             * Fires when at least one list item is selected.
             * @param {Ext.form.field.ComboBox} combo This combo box
             * @param {Array} records The selected records
             */
            'select',

            /**
             * @event beforeselect
             * Fires before the selected item is added to the collection
             * @param {Ext.form.field.ComboBox} combo This combo box
             * @param {Ext.data.Record} record The selected record
             * @param {Number} index The index of the selected record
             */
            'beforeselect',

            /**
             * @event beforedeselect
             * Fires before the deselected item is removed from the collection
             * @param {Ext.form.field.ComboBox} combo This combo box
             * @param {Ext.data.Record} record The deselected record
             * @param {Number} index The index of the deselected record
             */
            'beforedeselect'
        );

        me.bindStore(store || 'ext-empty-store', true);
        store = me.store;

        if (!Ext.isDefined(me.valueField)) {
            me.valueField = me.displayField;
        }

        if (!me.displayTpl) {
            me.displayTpl = new Ext.XTemplate(
                    '<tpl for=".">' +
                    '{[typeof values === "string" ? values : values["' + me.displayField + '"]]}' +
                    '<tpl if="xindex < xcount">' + me.delimiter + '</tpl>' +
                    '</tpl>'
            );
        } else if (Ext.isString(me.displayTpl)) {
            me.displayTpl = new Ext.XTemplate(me.displayTpl);
        }

        me.callParent();

        me.doQueryTask = new Ext.util.DelayedTask(me.doQuery, me);

        // store has already been loaded, setValue
        if (me.store.getCount() > 0) {
            me.setValue(me.value);
        }
    },

    /**
     * Returns the store associated with this ComboBox.
     * @return {Ext.data.Store} The store
     */
    getStore: function () {
        return this.store;
    },

    beforeBlur: function () {
        this.doQueryTask.cancel();
        this.assertValue();
    },

    // private
    assertValue: function () {
        var me = this,
            value = me.getRawValue(),
            rec;

        if (me.forceSelection) {
            if (me.multiSelect) {
                // For multiselect, check that the current displayed value matches the current
                // selection, if it does not then revert to the most recent selection.
                if (value !== me.getDisplayValue()) {
                    me.setValue(me.lastSelection);
                }
            } else {
                // For single-select, match the displayed value to a record and select it,
                // if it does not match a record then revert to the most recent selection.
                rec = me.findRecordByDisplay(value);
                if (rec) {
                    me.select(rec);
                } else {
                    me.setValue(me.lastSelection);
                }
            }
        }
        me.collapse();
    },

    onTypeAhead: function () {
        var me = this,
            displayField = me.displayField,
            record = me.store.findRecord(displayField, me.getRawValue()),
            view = me.getPicker(),
            newValue, len, selStart;

        if (record) {
            newValue = record.get(displayField);
            len = newValue.length;
            selStart = me.getRawValue().length;

            view.highlightItem(view.getNode(record));

            if (selStart !== 0 && selStart !== len) {
                me.setRawValue(newValue);
                me.selectText(selStart, newValue.length);
            }
        }
    },

    // invoked when a different store is bound to this combo
    // than the original
    resetToDefault: function () {

    },

    onUnbindStore: function (store) {
        var picker = this.picker;
        if (!store && picker) {
            picker.bindStore(null);
        }
    },

    onBindStore: function (store, initial) {
        var picker = this.picker;
        if (!initial) {
            this.resetToDefault();
        }
        if (picker) {
            picker.bindStore(store);
        }
    },

    getStoreListeners: function () {
        var me = this;

        return {
            beforeload: me.onBeforeLoad,
            clear: me.onClear,
            datachanged: me.onDataChanged,
            load: me.onLoad,
            exception: me.onException,
            remove: me.onRemove
        };
    },

    onBeforeLoad: function () {
        // If we're remote loading, the load mask will show which will trigger a deslectAll.
        // This selection change will trigger the collapse in onListSelectionChange. As such
        // we'll veto it for now and restore selection listeners when we've loaded.
        ++this.ignoreSelection;
    },

    onDataChanged: function () {
        var me = this;

        if (me.resizeComboToGrow()) {
            me.updateLayout();
        }
    },

    onClear: function () {
        var me = this;

        if (me.resizeComboToGrow()) {
            me.removingRecords = true;
            me.onDataChanged();
        }
    },

    onRemove: function () {
        var me = this;

        if (me.resizeComboToGrow()) {
            me.removingRecords = true;
        }
    },

    onException: function () {
        if (this.ignoreSelection > 0) {
            --this.ignoreSelection;
        }
        this.collapse();
    },

    onLoad: function () {
        var me = this,
            value = me.value;

        me.isLoaded = true;

        if (me.ignoreSelection > 0) {
            --me.ignoreSelection;
        }

        // Set the value on load
        if (me.value || me.value === 0) {
            me.setValue(me.value);
        } else {
            // There's no value.
            // Highlight the first item in the list if autoSelect: true
            if (me.store.getCount()) {
                me.doAutoSelect();
            } else {
                // assign whatever empty value we have to prevent change from firing
                me.setValue(me.value);
            }
        }
    },

    /**
     * Executes a query to filter the dropdown list. Fires the {@link #beforequery} event prior to performing the query
     * allowing the query action to be canceled if needed.
     */
    doQuery: function () {
        var me = this,
            qe = {
                combo: me,
                cancel: false
            },
            store = me.store;

        // expand before starting query so LoadMask can position itself correctly
        me.expand();

        //        if (!me.isLoaded)
        //            store.load();

        // Clear current selection if it does not match the current value in the field
        if (me.getRawValue() !== me.getDisplayValue()) {
            me.ignoreSelection++;
            me.picker.getSelectionModel().deselectAll();
            me.ignoreSelection--;
        }

        if (me.typeAhead) {
            me.doTypeAhead();
        }

        return true;
    },

    /**
     * @private
     * If the autoSelect config is true, and the picker is open, highlights the first item.
     */
    doAutoSelect: function () {
        var me = this,
            picker = me.picker,
            lastSelected, itemNode;
        if (picker && me.autoSelect && me.store.getCount() > 0) {
            // Highlight the last selected item and scroll it into view
            lastSelected = picker.getSelectionModel().lastSelected;
            itemNode = picker.getNode(lastSelected || 0);
            if (itemNode) {
                picker.highlightItem(itemNode);
                picker.listEl.scrollChildIntoView(itemNode, false);
            }
        }
    },

    doTypeAhead: function () {
        if (!this.typeAheadTask) {
            this.typeAheadTask = new Ext.util.DelayedTask(this.onTypeAhead, this);
        }
        if (this.lastKey != Ext.EventObject.BACKSPACE && this.lastKey != Ext.EventObject.DELETE) {
            this.typeAheadTask.delay(this.typeAheadDelay);
        }
    },

    onTriggerClick: function () {
        var me = this;
        if (!me.readOnly && !me.disabled) {
            if (me.isExpanded) {
                me.collapse();
            } else {
                me.onFocus({});
                me.doQuery();
            }
            me.inputEl.focus();
        }
    },


    // store the last key and doQuery if relevant
    onKeyUp: function (e, t) {
        var me = this,
            key = e.getKey();

        if (!me.readOnly && !me.disabled && me.editable) {
            me.lastKey = key;
            // we put this in a task so that we can cancel it if a user is
            // in and out before the queryDelay elapses

            // perform query w/ any normal key or backspace or delete
            if (!e.isSpecialKey() || key == e.BACKSPACE || key == e.DELETE) {
                me.doQueryTask.delay(me.doQuery);
            }
        }

        if (me.enableKeyEvents) {
            me.callParent(arguments);
        }
    },

    initEvents: function () {
        var me = this;
        me.callParent();

        /*
         * Setup keyboard handling. If enableKeyEvents is true, we already have
         * a listener on the inputEl for keyup, so don't create a second.
         */
        if (!me.enableKeyEvents) {
            me.mon(me.inputEl, 'keyup', me.onKeyUp, me);
        }
    },

    onDestroy: function () {
        this.bindStore(null);
        this.callParent();
    },

    // The picker (the dropdown) must have its zIndex managed by the same ZIndexManager which is
    // providing the zIndex of our Container.
    onAdded: function () {
        var me = this;
        me.callParent(arguments);
        if (me.picker) {
            me.picker.ownerCt = me.up('[floating]');
            me.picker.registerWithOwnerCt();
        }
    },

    createPicker: function () {
        var me = this,
            picker,
            menuCls = Ext.baseCSSPrefix + 'menu',
            pickerCfg = Ext.apply({
                xtype: 'treepanel',
                pickerField: me,
                selModel: {
                    mode: me.multiSelect ? 'SIMPLE' : 'SINGLE'
                },
                floating: true,
                hidden: true,

                // The picker (the dropdown) must have its zIndex managed by the same ZIndexManager which is
                // providing the zIndex of our Container.
                ownerCt: me.up('[floating]'),
                cls: me.el && me.el.up('.' + menuCls) ? menuCls : '',
                store: me.store,
                focusOnToFront: false,
                tpl: me.tpl
            }, me.listConfig, me.defaultListConfig);

        if (me.columns)
            pickerCfg.columns = me.columns;

        picker = me.picker = Ext.widget(pickerCfg);

        me.mon(picker, {
            itemclick: me.onItemClick,
            load: me.onListRefresh,
            itemexpand: me.updateLayout,
            scope: me
        });

        me.mon(picker.getSelectionModel(), {
            beforeselect: me.onBeforeSelect,
            beforedeselect: me.onBeforeDeselect,
            selectionchange: me.onListSelectionChange,
            scope: me
        });

        return picker;
    },

    alignPicker: function () {
        var me = this,
            picker = me.getPicker(),
            heightAbove = me.getPosition()[1] - Ext.getBody().getScroll().top,
            heightBelow = Ext.Element.getViewHeight() - heightAbove - me.getHeight(),
            space = Math.max(heightAbove, heightBelow);

        // Allow the picker to height itself naturally.
        if (picker.height) {
            delete picker.height;
            picker.updateLayout();
        }
        // Then ensure that vertically, the dropdown will fit into the space either above or below the inputEl.
        if (picker.getHeight() > space - 5) {
            picker.setHeight(space - 5); // have some leeway so we aren't flush against
        }
        me.callParent();
    },

    onListRefresh: function () {

        this.alignPicker();
        //        //this.syncSelection();
    },

    onItemClick: function (picker, record) {
        /*
         * If we're doing single selection, the selection change events won't fire when
         * clicking on the selected element. Detect it here.
         */
        var me = this,
            selection = me.picker.getSelectionModel().getSelection(),
            valueField = me.valueField;

        if (!me.multiSelect && selection.length) {
            if (record.get(valueField) === selection[0].get(valueField)) {
                // Make sure we also update the display value if it's only partial
                me.displayTplData = [record.data];
                me.setRawValue(me.getDisplayValue());
                me.collapse();
            }
        }
    },

    onBeforeSelect: function (list, record) {
        return this.fireEvent('beforeselect', this, record, record.index);
    },

    onBeforeDeselect: function (list, record) {
        return this.fireEvent('beforedeselect', this, record, record.index);
    },

    onListSelectionChange: function (list, selectedRecords) {
        var me = this,
            isMulti = me.multiSelect,
            hasRecords = selectedRecords.length > 0;
        // Only react to selection if it is not called from setValue, and if our list is
        // expanded (ignores changes to the selection model triggered elsewhere)
        if (!me.ignoreSelection && me.isExpanded) {
            if (!isMulti) {
                Ext.defer(me.collapse, 1, me);
            }
            /*
             * Only set the value here if we're in multi selection mode or we have
             * a selection. Otherwise setValue will be called with an empty value
             * which will cause the change event to fire twice.
             */
            if (isMulti || hasRecords) {
                me.setValue(selectedRecords, false);
            }
            if (hasRecords) {
                me.fireEvent('select', me, selectedRecords);
            }
            me.inputEl.focus();
        }
    },

    /**
     * @private
     * Enables the key nav for the BoundList when it is expanded.
     */
    onExpand: function () {
        var me = this,
            keyNav = me.listKeyNav,
            selectOnTab = me.selectOnTab,
            picker = me.getPicker();

        // Handle BoundList navigation from the input field. Insert a tab listener specially to enable selectOnTab.
        if (keyNav) {
            keyNav.enable();
        } else {
            keyNav = me.listKeyNav = new Ext.view.BoundListKeyNav(this.inputEl, {
                boundList: picker,
                forceKeyDown: true,
                tab: function (e) {
                    if (selectOnTab) {
                        this.selectHighlighted(e);
                        me.triggerBlur();
                    }
                    // Tab key event is allowed to propagate to field
                    return true;
                }
            });
        }

        // While list is expanded, stop tab monitoring from Ext.form.field.Trigger so it doesn't short-circuit selectOnTab
        if (selectOnTab) {
            me.ignoreMonitorTab = true;
        }

        Ext.defer(keyNav.enable, 1, keyNav); //wait a bit so it doesn't react to the down arrow opening the picker
        me.inputEl.focus();
    },

    /**
     * @private
     * Disables the key nav for the BoundList when it is collapsed.
     */
    onCollapse: function () {
        var me = this,
            keyNav = me.listKeyNav;
        if (keyNav) {
            keyNav.disable();
            me.ignoreMonitorTab = false;
        }
    },

    /**
     * Selects an item by a {@link Ext.data.Model Model}, or by a key value.
     * @param {Object} r
     */
    select: function (r) {
        this.setValue(r, true);
    },

    /**
     * Finds the record by searching for a specific field/value combination.
     * @param {String} field The name of the field to test.
     * @param {Object} value The value to match the field against.
     * @return {Ext.data.Model} The matched record or false.
     */
    findRecord: function (field, value) {
        var ds = this.store,
            root = ds.getRootNode();
        return root != null ? root.findChild(field, value, true) : false;
    },

    /**
     * Finds the record by searching values in the {@link #valueField}.
     * @param {Object} value The value to match the field against.
     * @return {Ext.data.Model} The matched record or false.
     */
    findRecordByValue: function (value) {
        return this.findRecord(this.valueField, value);
    },

    /**
     * Finds the record by searching values in the {@link #displayField}.
     * @param {Object} value The value to match the field against.
     * @return {Ext.data.Model} The matched record or false.
     */
    findRecordByDisplay: function (value) {
        return this.findRecord(this.displayField, value);
    },

    /**
     * Sets the specified value(s) into the field. For each value, if a record is found in the {@link #store} that
     * matches based on the {@link #valueField}, then that record's {@link #displayField} will be displayed in the
     * field. If no match is found, and the {@link #valueNotFoundText} config option is defined, then that will be
     * displayed as the default field text. Otherwise a blank value will be shown, although the value will still be set.
     * @param {String/String[]} value The value(s) to be set. Can be either a single String or {@link Ext.data.Model},
     * or an Array of Strings or Models.
     * @return {Ext.form.field.Field} this
     */
    setValue: function (value, doSelect) {
        var me = this,
            valueNotFoundText = me.valueNotFoundText,
            inputEl = me.inputEl,
            i, len, record,
            models = [],
            displayTplData = [],
            processedValue = [];

        if (me.store.loading) {
            // Called while the Store is loading. Ensure it is processed by the onLoad method.
            me.value = value;
            me.setHiddenValue(me.value);
            return me;
        }

        // This method processes multi-values, so ensure value is an array.
        value = Ext.Array.from(value);

        // Loop through values
        for (i = 0, len = value.length; i < len; i++) {
            record = value[i];
            if (!record || !record.isModel) {
                record = me.findRecordByValue(record);
            }
            // record found, select it.
            if (record) {
                models.push(record);
                displayTplData.push(record.data);
                processedValue.push(record.get(me.valueField));
                me.setHiddenValue(processedValue);
            }
            // record was not found, this could happen because
            // store is not loaded or they set a value not in the store
            else {
                // If we are allowing insertion of values not represented in the Store, then set the value, and the display value
                if (!me.forceSelection) {
                    displayTplData.push(value[i]);
                    processedValue.push(value[i]);
                }
                // Else, if valueNotFoundText is defined, display it, otherwise display nothing for this value
                else if (Ext.isDefined(valueNotFoundText)) {
                    displayTplData.push(valueNotFoundText);
                }
            }
        }

        // Set the value of this field. If we are multiselecting, then that is an array.        
        me.value = me.multiSelect ? processedValue : processedValue[0];
        if (!Ext.isDefined(me.value)) {
            me.value = null;
        }
        me.displayTplData = displayTplData; //store for getDisplayValue method
        me.lastSelection = me.valueModels = models;

        if (inputEl && me.emptyText && !Ext.isEmpty(value)) {
            inputEl.removeCls(me.emptyCls);
        }

        // Calculate raw value from the collection of Model data
        me.setRawValue(me.getDisplayValue());
        me.checkChange();

        if (doSelect !== false) {
            me.syncSelection();
        }
        me.applyEmptyText();

        return me;
    },

    /**
     * @private
     * Set the value of {@link #hiddenDataEl}
     * Dynamically adds and removes input[type=hidden] elements
     */
    setHiddenValue: function (values) {
        var me = this,
            name = me.hiddenName,
            dom;

        if (!me.hiddenDataEl || !name) {
            return;
        }
        values = Ext.Array.from(values);
        dom = me.hiddenDataEl.dom;

        if (!me.hiddenInput) {
            me.hiddenInput = Ext.widget('hidden', {
                renderTo: me.hiddenDataEl,
                name: name
            });
            if (this.ownerCt)
                this.ownerCt.add(me.hiddenInput);
        }
        me.hiddenInput.setValue(values.join(me.delimiter));
    },

    /**
     * @private Generates the string value to be displayed in the text field for the currently stored value
     */
    getDisplayValue: function () {
        return this.displayTpl.apply(this.displayTplData);
    },

    getValue: function () {
        // If the user has not changed the raw field value since a value was selected from the list,
        // then return the structured value from the selection. If the raw field value is different
        // than what would be displayed due to selection, return that raw value.
        var me = this,
            picker = me.picker,
            rawValue = me.getRawValue(), //current value of text field
            value = me.value; //stored value from last selection or setValue() call

        if (me.getDisplayValue() !== rawValue) {
            value = rawValue;
            me.value = me.displayTplData = me.valueModels = null;
            if (picker) {
                me.ignoreSelection++;
                picker.getSelectionModel().deselectAll();
                me.ignoreSelection--;
            }
        }

        return value;
    },

    getSubmitValue: function () {
        return this.getValue();
    },

    isEqual: function (v1, v2) {
        var fromArray = Ext.Array.from,
            i, len;

        v1 = fromArray(v1);
        v2 = fromArray(v2);
        len = v1.length;

        if (len !== v2.length) {
            return false;
        }

        for (i = 0; i < len; i++) {
            if (v2[i] !== v1[i]) {
                return false;
            }
        }

        return true;
    },

    /**
     * Clears any value currently set in the ComboBox.
     */
    clearValue: function () {
        this.setValue([]);
    },

    /**
     * @private Synchronizes the selection in the picker to match the current value of the combobox.
     */
    syncSelection: function () {
        var me = this,
            picker = me.picker,
            selection, selModel,
            values = me.valueModels || [],
            vLen = values.length, v, value;

        if (picker) {
            // From the value, find the Models that are in the store's current data
            selection = [];
            for (v = 0; v < vLen; v++) {
                value = values[v];

                if (value && value.isModel) {
                    selection.push(value);
                }
            }

            // Update the selection to match
            me.ignoreSelection++;
            selModel = picker.getSelectionModel();
            selModel.deselectAll();
            if (selection.length) {
                selModel.select(selection);
            }
            me.ignoreSelection--;
        }
    },

    onEditorTab: function (e) {
        var keyNav = this.listKeyNav;

        if (this.selectOnTab && keyNav) {
            keyNav.selectHighlighted(e);
        }
    }
});