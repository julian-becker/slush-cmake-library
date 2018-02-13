#include <<%= libraryName %>/export.h>
#include <iostream>

<%= LIBRARYNAME %>_API int <%= libraryName %>_api()
{
    std::cout << "hello from <%= libraryName %>" << std::endl;
    return 12345;
}
