#include <iostream>
#include <<%= libraryName %>/<%= libraryName %>.h>
#include <gtest/gtest.h>

TEST(<%= libraryName %>_api_foobar, returns_the_ultimate_result) {
    ASSERT_EQ(42, <%= libraryName %>_api());
}
