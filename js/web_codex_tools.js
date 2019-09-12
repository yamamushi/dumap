class SearchBox
{
    // Public functions
    constructor(parentNode)
    {
        if (!isDefined(parentNode))
            console.error("No parent node given to a searchBox class");

        this.parentNode = parentNode;
        this.HTMLNodes = {
            searchInput: null,
            searchClear: null,
            searchButton: null
        };
        this.eventHandlers = {};
        this.searchCallback = null;
        this.pendingInputSearch = null;
        this.onEnterOnly = false;

        this.events = {};
        this.events.onNewSearch = new Event();

        this.queryHtmlNodes();
        this.bindInputs();
    }

    setSearchCallback(searchCallbackFunction)
    {
        this.searchCallback = searchCallbackFunction;
    }

    getCurrentSearchString()
    {
        return this.HTMLNodes.searchInput.value;
    }

    blur()
    {
        if (isDefined(this.HTMLNodes.searchInput))
            this.HTMLNodes.searchInput.blur();
    }

    focus()
    {
        if (isDefined(this.HTMLNodes.searchInput))
            this.HTMLNodes.searchInput.focus();
    }

    setOnEnterOnly(onEnterOnly)
    {
        this.onEnterOnly = onEnterOnly;
    }

    // Private functions
    queryHtmlNodes()
    {
        let nodeList = this.parentNode.getElementsByClassName("search_box");
        if (nodeList.length >= 1)
        {
            this.HTMLNodes.searchInput = nodeList[0];
            if (nodeList.length > 1)
                console.error("More than one search_box in that node");
        }
        else
        {
            // Create search input
            let searchInput = createElement(this.parentNode, "input", "search_box");
            searchInput.setAttribute("placeholder", "Search...");
            searchInput.setAttribute("type", "text");
            this.parentNode.appendChild(searchInput);
            this.HTMLNodes.searchInput = searchInput;
        }

        nodeList = this.parentNode.getElementsByClassName("clear_search_box");
        if (nodeList.length >= 1)
        {
            this.HTMLNodes.searchClear = nodeList[0];
            if (nodeList.length > 1)
                console.error("More than one clear_search_box in that node");
        }
        else
        {
            // Create clear search input
            let clearSearchInput = createElement(this.parentNode, "span", "remove_search");
            clearSearchInput.classList.add("clear_search_box");
            this.parentNode.appendChild(clearSearchInput);
            this.HTMLNodes.searchClear = clearSearchInput;
        }

        nodeList = this.parentNode.getElementsByClassName("search_button");
        if (nodeList.length >= 1)
        {
            this.HTMLNodes.searchButton = nodeList[0];
            if (nodeList.length > 1)
                console.error("More than one search_button in that node");
        }
    }

    bindInputs()
    {
        let self = this;

        addEventHandler(this.HTMLNodes.searchInput, "click", function()
        {
            self.HTMLNodes.searchInput.select();
        }, false, this.eventHandlers);

        addEventHandler(this.HTMLNodes.searchInput, "blur", function()
        {
            if (isDefined(self.HTMLNodes.searchInput))
                self.blur();
        }, false, this.eventHandlers);

        addEventHandler(this.HTMLNodes.searchInput, "focus", function()
        {
            if (isDefined(self.HTMLNodes.searchInput))
                self.focus();
        }, false, this.eventHandlers);

        addEventHandler(this.HTMLNodes.searchInput, "keyup", function()
        {
            if (!self.onEnterOnly || event.keyCode === KeyEvent.KEY_ENTER)
                self.inputUpdate();
            else
                self.displayClearButton();
        }, false, this.eventHandlers);

        if (isDefined(this.HTMLNodes.searchClear))
        {
            addEventHandler(this.HTMLNodes.searchClear, "click", function()
            {
                self.clearSearchInput();
            }, false, this.eventHandlers);
        }

        if (isDefined(this.HTMLNodes.searchButton))
        {
            addEventHandler(this.HTMLNodes.searchButton, "click", function()
            {
                self.planneSearch();
            }, false, this.eventHandlers);
        }
    }

    displayClearButton()
    {
        if (isDefined(this.HTMLNodes.searchClear))
            this.HTMLNodes.searchClear.classList.toggle("on_search", this.HTMLNodes.searchInput.value.length >= 1);
    }

    clearSearchInput()
    {
        this.HTMLNodes.searchInput.value = "";
        this.inputUpdate();
    }

    inputUpdate()
    {
        this.displayClearButton();
        this.planneSearch();
    }

    planneSearch()
    {
        let self = this;
        clearTimeout(this.pendingInputSearch);
        this.pendingInputSearch = setTimeout(function()
        {
            self.search();
        }, 150);
    }

    search()
    {
        this.events.onNewSearch.execute(this.HTMLNodes.searchInput.value);
        if (typeof this.searchCallback === "function")
            this.searchCallback(this.HTMLNodes.searchInput.value);
    }

    setPlaceholder(placeholderValue)
    {
        this.HTMLNodes.searchInput.setAttribute("placeholder", placeholderValue);
    }
}

class Component
{
    constructor()
    {
        this._wrapper = this._createWrapperNode();
        this.isShow = true;
    }

    _createWrapperNode()
    {
        return createElement(null, "div");
    }

    get wrapperNode()
    {
        return this._wrapper;
    }

    show()
    {
        this._wrapper.classList.remove("hide");
        this.isShow = true;
    }

    hide()
    {
        this._wrapper.classList.add("hide");
        this.isShow = false;
    }
}

class Event
{
    constructor()
    {
        this._listeners = [];
    }

    subscribe(callback)
    {
        this._listeners.push(callback);
        return callback;
    }

    unsubscribe(callback)
    {
        var index = this._listeners.indexOf(callback);
        if (index > -1)
            this._listeners.splice(index, 1);
        else
            console.warn("Unsubscribe failed of callback: " + callback);
    }

    execute()
    {
        for (var l in this._listeners)
            this._listeners[l].apply(null, arguments);
    }
}

class DrilldownElement
{
    constructor(id, parentId, obj)
    {
        this.id = id;
        this.parentId = parentId;
        this.parent = null;
        this.children = [];
        this.eventHandlers = {};
        this.inputEvent = new Event();
        this.labelInfo = obj.label;
        this._initElement(obj);
        this._createWrapper();
        this._createNode(obj);
        this._node.classList.add("drilldownElement");
        this.wrapper.appendChild(this._node);
        this._onClickEvent = new Event();
        this._bindOnClickNode();
        this.isOpened = false;
    }

    get node()
    {
        return this.wrapper;
    }

    get label()
    {
        return this.labelInfo;
    }

    showAllChildren(isShow)
    {
        for (let key in this.children)
        {
            let child = this.children[key];
            child.showNode(isShow);
        }
    }

    showNode(isShow)
    {
        this.wrapper.classList.toggle("hide", !isShow);
        if (isDefined(this.parent) && !(this.parent instanceof Drilldown) && isShow)
        {
            this.parent.showNode(isShow);
        }
    }

    setData(dataObject)
    {}

    toggleOpen(isOpened)
    {
        this.isOpened = isDefined(isOpened) ? isOpened : !this.isOpened;
        if (isDefined(this.childrenZone))
        {
            this.childrenZone.classList.toggle("hide", !this.isOpened);
            this.wrapper.classList.toggle("expanded", this.isOpened);
        }
    }

    toggleParent(isOpened)
    {
        this.toggleOpen(isOpened);
        if (isDefined(this.parent) && !(this.parent instanceof Drilldown) && isOpened)
            this.parent.toggleParent(isOpened);
    }

    getChildCount()
    {
        return this.children.length;
    }

    registerToOnClickEvent(callback)
    {
        this._onClickEvent.subscribe(callback);
    }

    // Node that wrappe subNode of this element
    _createWrapper()
    {
        this.wrapper = document.createElement("div");
        this.wrapper.classList.add("drillDownElementWrapper");
    }

    // Node children drilldown elements are added as children. Created upon first child addition.
    _createChildrenNode()
    {
        this.childrenZone = document.createElement("div");
        this.wrapper.classList.add("withChildren");
        this.wrapper.appendChild(this.childrenZone);
        this.childrenZone.classList.add("drillDownElementChildrenZone");
        this.childrenZone.classList.toggle("hide", !this.isOpened);
        this.wrapper.classList.toggle("expanded", this.isOpened);
    }

    _addChild(childElement)
    {
        if (!isDefined(this.childrenZone))
            this._createChildrenNode();
        this.children.push(childElement);
        this.childrenZone.appendChild(childElement.node);
        childElement.parent = this;
    }

    _deleteChild(childElement)
    {
        let childElementIndex = this.children.indexOf(childElement);
        if (childElementIndex > -1)
        {
            this.childrenZone.removeChild(childElement.node);
            this.children.splice(childElementIndex, 1);
        }
    }

    _initElement(obj)
    {}

    // The one that derived class should overide.
    _createNode(obj)
    {
        this._node = document.createElement("div");
        this._node.innerText = this.id;
    }

    _bindOnClickNode()
    {
        if (isDefined(this._node))
        {
            let self = this;
            addEventHandler(this._node, "click", function()
            {
                self.toggleOpen();
                self._onClickEvent.execute();
            }, true, this.eventHandlers);
        }
    }
}

class DrilldownElementLabel extends DrilldownElement
{
    constructor(id, parentId, obj)
    {
        super(id, parentId, obj);
    }

    setData(dataObject)
    {
        if (isDefined(dataObject.label) && dataObject.label !== this._node.innerText)
            this._node.innerText = dataObject.label;
    }

    _createNode(obj)
    {
        this._node = document.createElement("div");
        this._node.classList.add("label");
        this._node.innerText = isDefined(obj.label) ? obj.label : this.id;
        if (isDefined(obj.additionalClass))
            addClassToElement(this._node, obj.additionalClass);
    }
}

class DrilldownElementLabelAndString extends DrilldownElement
{
    constructor(id, parentId, obj)
    {
        super(id, parentId, obj);
    }

    setData(dataObject)
    {
        if (isDefined(dataObject.label) && dataObject.label !== this.nodeLabel.innerText)
            this.nodeLabel.innerText = dataObject.label;
        if (isDefined(dataObject.value) && dataObject.value !== this.string.innerText)
            this.string.innerText = dataObject.value;
    }

    _createNode(obj)
    {
        this._node = document.createElement("div");
        this._node.classList.add("labelAndString");

        this.nodeLabel = document.createElement("div");
        this.nodeLabel.classList.add("label");
        this._node.appendChild(this.nodeLabel);

        this.string = document.createElement("div");
        this.string.classList.add("string");
        this._node.appendChild(this.string);

        let nodeLabel = isDefined(obj.label) ? obj.label : this.id;
        this.nodeLabel.innerText = nodeLabel;
    }
}
class DrilldownElementBoolean extends DrilldownElement
{
    constructor(id, parentId, obj)
    {
        super(id, parentId, obj);
    }

    setData(dataObject)
    {
        if (isDefined(dataObject.label) && dataObject.label !== this.nodeLabel.innerText)
            this.nodeLabel.innerText = dataObject.label;
        if (isDefined(dataObject.value))
            this.boolean.classList.toggle("true", dataObject.value);
    }

    _createNode(obj)
    {
        this._node = document.createElement("div");
        this._node.classList.add("labelWithBoolean");

        this.nodeLabel = document.createElement("div");
        this.nodeLabel.classList.add("label");
        this.nodeLabel.innerText = obj.label;
        this._node.appendChild(this.nodeLabel);

        this.boolean = document.createElement("div");
        this.boolean.classList.add("boolean");
        this._node.appendChild(this.boolean);
    }
}

class DrilldownElementValueWithDelta extends DrilldownElement
{
    constructor(id, parentId, obj)
    {
        super(id, parentId, obj);
    }

    get value()
    {
        return this._value;
    }

    set value(value)
    {
        this._value = value;
        let formatedValue = FormatNumber.getValueStringFromType(this._value, this.valueType, 2, this.numDecimal);
        if (this.valueNode.innerHTML !== formatedValue)
            this.valueNode.innerHTML = formatedValue;
    }

    get delta()
    {
        return this._delta;
    }
    set delta(value)
    {
        let formatedValue = FormatNumber.getValueStringFromType(value, this.valueType, 2, this.numDecimal);
        if (this._delta !== value || this.deltaNode.innerHTML !== formatedValue)
        {
            this.deltaNode.innerHTML = formatedValue;
            this._delta = value;
            this.deltaNode.classList.remove("positive", "negative", "neutral");
            if (value > 0)
                this.deltaNode.classList.add("positive");
            else if (value < 0)
                this.deltaNode.classList.add("negative");
            else
                this.deltaNode.classList.add("neutral");
        }
    }

    setData(dataObject)
    {
        if (isDefined(dataObject.label) && dataObject.label !== this.previousNodeLabel)
        {
            this.previousNodeLabel = dataObject.label;
            this.nodeLabel.innerText = dataObject.label;
        }
        if (isDefined(dataObject.valueType))
        {
            this.valueType = dataObject.valueType;
            this.value = this._value;
        }
        if (isDefined(dataObject.value))
        {
            this.value = dataObject.value;
            if (isDefined(dataObject.delta))
                this.delta = dataObject.delta;
            else
                this.delta = 0;
        }
        else if (isDefined(dataObject.delta))
        {
            this.delta = dataObject.delta;
        }
    }

    _initElement(obj)
    {
        this.valueType = isDefined(obj.valueUnit) ? obj.valueUnit : enumValueType.Qt;
        this.numDecimal = isDefined(obj.numDecimal) ? obj.numDecimal : 0;
        this._value = 0;
        this._delta = 0;
    }
    _createNode(obj)
    {
        this._node = document.createElement("div");
        this._node.classList.add("valueWithDelta");

        let nodeLabel = isDefined(obj.label) ? obj.label : this.id;
        this.nodeLabel = document.createElement("div");
        this.nodeLabel.classList.add("label");
        this.nodeLabel.innerText = nodeLabel;
        this._node.appendChild(this.nodeLabel);

        this.deltaNode = document.createElement("div");
        this.deltaNode.classList.add("delta");
        this._node.appendChild(this.deltaNode);

        this.valueNode = document.createElement("div");
        this.valueNode.classList.add("value");
        this.valueNode.innerText = "0";
        this._node.appendChild(this.valueNode);

        this.delta = this._delta;
        this.value = this._value;
    }
}

class DrilldownElementList extends DrilldownElement
{
    constructor(id, parentId, obj)
    {
        super(id, parentId, obj);
    }

    setData(dataObject)
    {
        if (isDefined(dataObject.label) && dataObject.label !== this.nodeLabel.innerText)
            this.nodeLabel.innerText = dataObject.label;
        if (isDefined(dataObject.valueType))
            this.valueType = dataObject.valueType;
        if (!isDefined(dataObject.value))
            return;
        let newListElem = dataObject.value;
        let oldListElementsKeys = Object.keys(this.listElem);
        let newListElemKeys = Object.keys(newListElem);

        // Clear previous node that were listed but are no longer listed
        for (let index in oldListElementsKeys)
        {
            let oldKey = oldListElementsKeys[index];
            if (!newListElemKeys.includes(oldKey))
            {
                // Remove a node
                let node = this.rows[oldKey].node;
                this.table.removeChild(node);
                delete this.rows[oldKey];
            }
        }

        // Update existing entry, and add new ones.
        for (let index in newListElemKeys)
        {
            let newKey = newListElemKeys[index];
            if (!oldListElementsKeys.includes(newKey))
            {
                // Create a node
                this.rows[newKey] = this._createRow();
                this.table.appendChild(this.rows[newKey].node);
            }
            let row = this.rows[newKey];
            this._setRowData(row, newListElem[newKey]);
        }
        this.listElem = newListElem;
    }

    _setRowData(row, data)
    {
        if (isDefined(data.label) && data.label !== row.previousNodeLabel)
        {
            row.previousNodeLabel = data.label;
            row.labelNode.innerText = data.label;
        }
    }

    _initElement(obj)
    {
        this.listElem = {};
        this.rows = {};
    }

    _createNode(obj)
    {
        this._node = document.createElement("div");
        this._node.classList.add("elementsList");

        this.nodeLabel = document.createElement("div");
        this.nodeLabel.classList.add("label");
        this.nodeLabel.innerText = obj.label;
        this._node.appendChild(this.nodeLabel);

        this.table = document.createElement("div");
        this.table.classList.add("elementsListParentList");
        this._node.appendChild(this.table);
    }

    _createRow()
    {
        let row = {};
        row.node = document.createElement("div");
        row.node.classList.add("aElementWrapper");

        row.labelNode = document.createElement("div");
        row.labelNode.classList.add("label");
        row.node.appendChild(row.labelNode);

        return row;
    }

}
class DrilldownElementListWithDeltas extends DrilldownElementList
{
    constructor(id, parentId, obj)
    {
        super(id, parentId, obj);
    }

    _setRowData(row, data)
    {
        super._setRowData(row, data);
        if (isDefined(data.value))
        {
            let delta = data.delta;
            row.value = data.value;

            let formatedValue = FormatNumber.getValueStringFromType(row.value, this.valueType, 2, this.numDecimal);
            if (row.valueNode.innerHTML !== formatedValue)
                row.valueNode.innerHTML = formatedValue;
            formatedValue = FormatNumber.getValueStringFromType(delta, this.valueType, 2, this.numDecimal);
            if (row.nodeDelta.innerHTML !== formatedValue)
            {
                row.nodeDelta.innerHTML = formatedValue;
                row.nodeDelta.classList.remove("positive", "negative", "neutral");
                if (delta > 0)
                    row.nodeDelta.classList.add("positive");
                else if (delta < 0)
                    row.nodeDelta.classList.add("negative");
                else
                    row.nodeDelta.classList.add("neutral");
            }
        }
    }

    _initElement(obj)
    {
        super._initElement(obj);
        this.numDecimal = isDefined(obj.numDecimal) ? obj.numDecimal : 0;
        this.valueType = isDefined(obj.valueUnit) ? obj.valueUnit : enumValueType.Qt;
    }

    _createRow()
    {
        let row = super._createRow();
        row.value = 0;

        row.nodeDelta = document.createElement("div");
        row.nodeDelta.classList.add("delta");
        row.node.appendChild(row.nodeDelta);

        row.valueNode = document.createElement("div");
        row.valueNode.classList.add("value");
        row.node.appendChild(row.valueNode);

        return row;
    }
}

// Fixed size tab
class DrilldownElementMatrixWithDeltas extends DrilldownElement
{
    constructor(id, parentId, obj)
    {
        super(id, parentId, obj);
    }

    setData(dataObject)
    {
        if (isDefined(dataObject.label) && dataObject.label !== this.labelInfo)
        {
            this.labelInfo = dataObject.label;
            this.nodeLabel.innerHTML = dataObject.label + " [" + FormatNumber.getBasicUnitStringFromType(this.valueType) + "]";
        }
        if (isDefined(dataObject.valueType) && dataObject.valueType !== this.valueType)
        {
            this.valueType = dataObject.valueType;
            this.nodeLabel.innerHTML = this.label + " [" + FormatNumber.getBasicUnitStringFromType(this.valueType) + "]";
        }

        if (isDefined(dataObject.value))
        {
            for (let y = 0; y < this.dimY; y++)
            {
                for (let x = 0; x < this.dimX; x++)
                {
                    if (isDefined(dataObject.value[x + y * this.dimY]))
                    {
                        let delta = 0;
                        if (isDefined(dataObject.delta))
                            delta = dataObject.delta[x + y * this.dimY];
                        this._setValue(x, y, dataObject.value[x + y * this.dimY], delta);
                    }
                    else
                        console.error("Table transmited is smaller than the expected table. Expected tab lenght :" + this.dimY * this.dimX + " , failed at lenght : " + x + y * this.dimY);
                }
            }
        }
    }

    _initElement(obj)
    {
        if (!isDefined(obj.dimX) || !isDefined(obj.dimY))
            console.error("Dimensions missing for the matrix size.");
        this.dimX = isDefined(obj.dimX) ? obj.dimX : 0;
        this.dimY = isDefined(obj.dimY) ? obj.dimY : 0;
        this.valueType = isDefined(obj.valueUnit) ? obj.valueUnit : enumValueType.Qt;
        this.tabCase = [];
        this.tabValue = [];
        for (let y = 0; y < this.dimY; y++)
        {
            this.tabCase[y] = [];
            this.tabValue[y] = [];
        }
        this.tabRowNodes = [];
        this.numDecimal = isDefined(obj.numDecimal) ? obj.numDecimal : 0;
    }

    _setValue(x, y, newVal, delta)
    {
        this.tabValue[y][x] = newVal;

        let formatedValue = FormatNumber.getValueStringFromType(newVal, enumValueType.Qt, 2, this.numDecimal);
        if (this.tabCase[y][x].nodeValue.innerHTML !== formatedValue)
            this.tabCase[y][x].nodeValue.innerHTML = formatedValue;

        formatedValue = FormatNumber.getValueStringFromType(delta, enumValueType.Qt, 2, this.numDecimal);
        if (this.tabCase[y][x].nodeDelta.innerHTML !== formatedValue)
        {
            this.tabCase[y][x].nodeDelta.innerHTML = formatedValue;

            this.tabCase[y][x].nodeDelta.classList.remove("positive", "negative", "neutral");
            if (delta > 0)
                this.tabCase[y][x].nodeDelta.classList.add("positive");
            else if (delta < 0)
                this.tabCase[y][x].nodeDelta.classList.add("negative");
            else
                this.tabCase[y][x].nodeDelta.classList.add("neutral");
        }
    }

    _createNode(obj)
    {
        this._node = document.createElement("div");
        this._node.classList.add("matrix");

        this.nodeLabel = createElement(this._node, "div", "label");
        this.nodeLabel.innerText = obj.label;

        this.tab = createElement(this._node, "div", "matrixTable");

        for (let y = 0; y < this.dimY; y++)
        {
            this.tabRowNodes[y] = document.createElement("div");
            this.tabRowNodes[y].classList.add("row");
            this.tab.appendChild(this.tabRowNodes[y]);

            for (let x = 0; x < this.dimX; x++)
            {
                let aCase = this.tabCase[y][x] = {};
                aCase.node = document.createElement("div");
                aCase.node.classList.add("case");

                aCase.nodeValue = document.createElement("div");
                aCase.nodeValue.classList.add("value");
                aCase.nodeValue.innerText = "0";
                aCase.node.appendChild(aCase.nodeValue);

                aCase.nodeDelta = document.createElement("div");
                aCase.nodeDelta.classList.add("delta");
                aCase.nodeDelta.innerText = "0";
                aCase.node.appendChild(aCase.nodeDelta);

                this.tabRowNodes[y].appendChild(aCase.node);
            }
        }
    }
}

class DrilldownElementLabelWithInputs extends DrilldownElementLabel
{
    constructor(id, parentId, obj)
    {
        super(id, parentId, obj);
    }

    _initElement(obj)
    {
        super._initElement(obj);
        this.inputs = {};
    }

    _createNode(obj)
    {
        this._node = document.createElement("div");
        this._node.classList.add("labelWithInput");
        addClassToElement(this._node, obj.additionalClass);

        this.icon = createElement(this._node, "img", "icon");
        let iconObj = obj.icon;
        if (isDefined(iconObj))
            addClassToElement(this.icon, iconObj.additionalClass);

        this.nodeLabel = createElement(this._node, "div", "label");
        this.nodeLabel.innerText = isDefined(obj.label) ? obj.label : "";

        let inputsListObj = obj.inputs;
        if (isDefined(inputsListObj))
        {
            for (let index in inputsListObj)
            {
                let inputObj = inputsListObj[index];
                if (isDefined(inputObj.inputId) && isDefined(inputObj.nodeType))
                {
                    let input = createElement(this._node, inputObj.nodeType, null);
                    input.setAttribute("type", inputObj.type);

                    if (isDefined(inputObj.additionalClass))
                        addClassToElement(input, inputObj.additionalClass);

                    if (isDefined(inputObj.attributes))
                    {
                        for (let id in inputObj.attributes)
                        {
                            let attribute = inputObj.attributes[id];
                            input.setAttribute(id, attribute);
                        }
                    }

                    this.inputs[inputObj.inputId] = input;
                }
                else
                    console.warn("input need an input id or a node type to be initialized");
            }
        }
    }

    getInputByInputId(inputId)
    {
        if (!isDefined(inputId))
        {
            console.warn("DrilldownElement.getInputByInputId: Input id is undefined");
            return null;
        }

        return this.inputs[inputId];
    }
}

class DrilldownElementAnchor extends DrilldownElement
{
    constructor(id, parentId, obj)
    {
        super(id, parentId, obj);
    }

    setData(dataObject)
    {
        if (isDefined(dataObject.label) && dataObject.label !== this._node.innerText)
            this._node.innerText = dataObject.label;
    }

    _createNode(obj)
    {
        this._node = document.createElement("div");
        this._node.classList.add("elementAnchor");
        if (isDefined(obj.additionalClass))
            addClassToElement(this._node, obj.additionalClass);

        this.anchor = createElement(this._node, "a", "anchor");
        this.anchor.textContent = obj.label;
        this.anchor.href = "#" + obj.id;
    }
}

class NavigationDrilldown extends Component
{
    constructor(modelDrilldown)
    {
        super();
        this.modelDrilldown = modelDrilldown;
        this.drilldown = new Drilldown("navigation_drilldown");

        this._drilldownElementsMap = new Map();
        this._modelDrilldownMainChildElement = {
            typeNode: "Label",
            parentId: null,
            additionalClass: ["mainSection"]
        };
        this._modelDrilldownSubChildElement = {
            typeNode: "Anchor",
            additionalClass: ["subChild"]
        };

        this._generateNavigationDrilldown();
    }

    // Private Functions

    _generateNavigationDrilldown()
    {
        this._wrapper.appendChild(this.drilldown.wrapperNode);
        for (let key in this.modelDrilldown)
        {
            let modelElement = this.modelDrilldown[key];
            let templateModelElement = isDefined(modelElement.parentId) ? this._modelDrilldownSubChildElement : this._modelDrilldownMainChildElement;

            let obj = Object.assign({}, modelElement, templateModelElement);
            let drilldownElement = this.drilldown.drillDownElementFactory(obj);
            this._drilldownElementsMap.set(key, drilldownElement);
            this.drilldown.addElement(drilldownElement);
        }
    }

    _showDrilldownElement(drilldownElement, isShow, isOpen)
    {
        if (!(drilldownElement instanceof DrilldownElement))
        {
            console.warn("NavigationDrilldown._showDrilldownElement: drilldownElement is not an instance of Drilldown Element");
            return;
        }

        drilldownElement.showAllChildren(isShow);
        drilldownElement.showNode(isShow);
        drilldownElement.toggleOpen(isOpen);
    }

    _getDrilldownElementsByLabel(searchLabel)
    {
        let drilldownElementsList = [];
        for (let drilldownElement of this._drilldownElementsMap.values())
        {
            let drilldownElementLabel = drilldownElement.label.toUpperCase();
            if (drilldownElementLabel.indexOf(searchLabel) > -1)
                drilldownElementsList.push(drilldownElement);
        }
        return drilldownElementsList;
    }

    _showDrilldownElementsByLabel(searchLabel)
    {
        if (searchLabel.length == 0)
            this._toggleAllDrilldownElements(true, false);
        else
        {
            this._toggleAllDrilldownElements(false, true);
            let uppercaseSearchLabel = searchLabel.toUpperCase();
            let drilldownElementsList = this._getDrilldownElementsByLabel(uppercaseSearchLabel);
            for (let drilldownElement of drilldownElementsList)
                this._showDrilldownElement(drilldownElement, true, true);
        }
    }

    _toggleAllDrilldownElements(isShow, isOpen)
    {
        for (let drilldownElement of this._drilldownElementsMap.values())
            this._showDrilldownElement(drilldownElement, isShow, isOpen);
    }

    // Public Functions

    searchDrilldownElementsByLabel(searchLabel)
    {
        this._showDrilldownElementsByLabel(searchLabel);
    }
}

class Drilldown extends Component
{
    constructor(additionalClass)
    {
        super();
        let drilldownWrapperClass = isDefined(additionalClass) ? additionalClass : "drilldown_generic";
        addClassToElement(this._wrapper, drilldownWrapperClass);
        this.nodes = {};
    }

    // Return a genDrilldownElements from the jsonElem model base
    drillDownElementFactory(jsonElem)
    {
        let Type = this._typeFromString(jsonElem.typeNode);
        let id = jsonElem.id;
        let elem = new Type(id, jsonElem.parentId, jsonElem);
        elem.typeNode = jsonElem.typeNode;
        return elem;
    }

    searchNode(nodeName)
    {
        return isDefined(this.nodes[nodeName]) ? this.nodes[nodeName] : null;
    }

    deleteElement(element)
    {
        if (isDefined(this.nodes[element.id]))
        {
            let parent = this.searchNode(element.parentId);
            if (!isDefined(parent))
            {
                console.error("This element has no parent");
                return;
            }

            parent._deleteChild(element);
            delete this.nodes[element.id];
        }
        else
        {
            console.error("No element with this id");
            return;
        }
    }

    addElement(element)
    {
        if (!isDefined(this.nodes[element.id]))
        {
            let parent = this.searchNode(element.parentId);
            if (!isDefined(parent))
                parent = this;

            parent._addChild(element);
            this.nodes[element.id] = element;
        }
        else
        {
            console.error("An element already exist with the id: " + element.id + " The new one will not be added");
            return null;
        }

        return this.nodes[element.id];
    }

    has(elementId)
    {
        return isDefined(this.nodes[elementId]);
    }

    get(elementId)
    {
        return this.nodes[elementId];
    }

    _addChild(element)
    {
        if (!isDefined(this.nodes[element.id]))
        {
            this._wrapper.appendChild(element.node);
            element.parent = this;
        }
        else
        {
            console.error("An element already exist with the id: " + element.id + " The new one will not be added");
            return;
        }
    }

    _deleteChild(element)
    {
        if (isDefined(this.nodes[element.id]))
            this._wrapper.removeChild(element.node);
        else
        {
            console.error("the element with the id: " + element.id + " is not instantiate");
            return;
        }
    }

    // Return the type of a drilldown elements from a string
    _typeFromString(typeName)
    {
        switch (typeName)
        {
            case "ValueWithDelta":
                return DrilldownElementValueWithDelta;
                break;
            case "Label":
                return DrilldownElementLabel;
                break;
            case "LabelAndString":
                return DrilldownElementLabelAndString;
                break;
            case "LabelWithBoolean":
                return DrilldownElementBoolean;
                break;
            case "ListWithValues":
                return DrilldownElementListWithDeltas;
                break;
            case "ListLabel":
                return DrilldownElementList;
                break;
            case "Matrix":
                return DrilldownElementMatrixWithDeltas;
                break;
            case "LabelWithInput":
                return DrilldownElementLabelWithInputs;
                break;
            case "Anchor":
                return DrilldownElementAnchor;
                break;
            default:
                console.error("Unrecognized node type : " + typeName);
                return DrilldownElement;
                break;

        }
    }
}

class CodexParser
{
    constructor()
    {
        this._modelCodexNavigationDrilldown = {};
    }

    // Private Functions

    _parseSections(nodesList, parentId)
    {
        let modelCodexNavigationDrilldown = {};
        for (let node of nodesList)
        {
            if (isElement(node))
            {
                this._setNodeInfo(node, parentId);

                // If there are not section nodes we parse h3 nodes
                let childParentId = node.getAttribute("id");
                let childrenNodesList = (node.querySelectorAll("section").length > 0) ? node.querySelectorAll("section") : node.querySelectorAll("h3");
                this._parseSections(childrenNodesList, childParentId);
            }
            else
                console.warn("HUDCodex._parseSections: the element parsing is not an HTMLElement");
        }
    }

    _setNodeInfo(sectionNode, parentId)
    {
        let title = sectionNode.getAttribute("title");
        let id = sectionNode.getAttribute("id");
        this._modelCodexNavigationDrilldown[id] = {
            parentId: parentId,
            label: title,
            id: id
        };
    }

    // Public Functions

    getModelCodexNavigation(mainSectionsList)
    {
        if (!isDefined(mainSectionsList))
        {
            console.warn("CodexParser.parseCodex: mainSectionsList is undefined");
            return {};
        }
        this._parseSections(mainSectionsList, null);
        return this._modelCodexNavigationDrilldown;
    }
}

