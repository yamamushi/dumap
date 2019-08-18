function isElement(element)
{
    return element instanceof Element || element instanceof HTMLDocument;
}

function createElement(parent, type, className)
{
    var child = document.createElement(type);
    if (isDefined(className))
        addClassToElement(child, className);

    if (!isDefined(parent) && parent !== null)
        console.error("no parent defined and not clearly set to null");
    else if (isDefined(parent))
        parent.appendChild(child);

    return child;
}

function addClassToElement(element, className)
{
    if (isDefined(element) && isDefined(className))
    {
        if (isDefined(className) && Array.isArray(className))
        {
            element.classList.add.apply(
                element.classList,
                className
            );
        }
        else
        {
            if (!element.classList.contains(className))
                element.classList.add(className);
        }
    }
}

/* Check if the element is undefined or null */
function isDefined(val)
{
    return typeof val !== "undefined" && val !== null;
}

/* Functions to manage the events handler on element */
function addEventHandler(node, event, handler, capture, eventHandlers)
{
    if (!(node in eventHandlers))
    {
        eventHandlers[node] = {};
    }
    if (!(event in eventHandlers[node]))
    {
        eventHandlers[node][event] = null;
    }

    if (typeof eventHandlers[node][event] !== "undefined" && eventHandlers[node][event] !== null)
    {
        var eventHandler = eventHandlers[node][event];
        node.removeEventListener(event, eventHandler[0], eventHandler[1]);
    }

    eventHandlers[node][event] = [handler, capture];
    node.addEventListener(event, handler, capture);
}
