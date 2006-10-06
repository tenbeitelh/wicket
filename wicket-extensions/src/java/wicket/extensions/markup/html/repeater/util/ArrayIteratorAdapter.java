/*
 * $Id: ArrayIteratorAdapter.java 3399 2005-12-09 07:43:11 +0000 (Fri, 09 Dec
 * 2005) ivaynberg $ $Revision$ $Date: 2005-12-09 07:43:11 +0000 (Fri, 09
 * Dec 2005) $
 * 
 * ==================================================================== Licensed
 * under the Apache License, Version 2.0 (the "License"); you may not use this
 * file except in compliance with the License. You may obtain a copy of the
 * License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */
package wicket.extensions.markup.html.repeater.util;

import java.util.Iterator;

import wicket.model.IModel;

/**
 * Iterator over an array. Implementation must provide
 * {@link ArrayIteratorAdapter#model(Object) } method to wrap each item in a
 * model before it is returned through {@link ArrayIteratorAdapter#next() }
 * method.
 * 
 * @author Igor Vaynberg (ivaynberg)
 * 
 */
public abstract class ArrayIteratorAdapter implements Iterator
{
	private Object[] array;
	private int pos = 0;

	/**
	 * Constructor
	 * 
	 * @param array
	 */
	public ArrayIteratorAdapter(Object[] array)
	{
		this.array = array;
	}

	/**
	 * @see java.util.Iterator#remove()
	 */
	public void remove()
	{
		throw new UnsupportedOperationException("remove() is not allowed");
	}

	/**
	 * @see java.util.Iterator#hasNext()
	 */
	public boolean hasNext()
	{
		return pos < array.length;
	}

	/**
	 * @see java.util.Iterator#next()
	 */
	public Object next()
	{
		IModel model = model(array[pos], pos);
		pos++;
		return model;
	}

	/**
	 * Resets the iterator position back to the beginning of the array
	 */
	public void reset()
	{
		pos = 0;
	}

	/**
	 * This method is used to wrap the provided object with an implementation of
	 * IModel. The provided object is guaranteed to be returned from the
	 * delegate iterator.
	 * 
	 * @param object
	 *            object to be wrapped
	 * @param index
	 *            array index of the object
	 * @return IModel wrapper for the object
	 */
	abstract protected IModel model(Object object, int index);


}
