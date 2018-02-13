cmake_minimum_required(VERSION 3.5)
project(<%= libraryName %>_test LANGUAGES CXX)

find_package(Catch2 REQUIRED)
find_package(<%= libraryName %> REQUIRED)

add_executable(${PROJECT_NAME} src/test1.cpp)
target_compile_features(${PROJECT_NAME} PRIVATE cxx_std_14)

target_link_libraries(${PROJECT_NAME}
  PRIVATE
    <%= libraryName %>::<%= libraryName %>
    Catch2::Catch
)

add_test(
  NAME    ${PROJECT_NAME}
  COMMAND $<TARGET_FILE:${PROJECT_NAME}>
)
